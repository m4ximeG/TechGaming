import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/integrations/firebase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp
} from "firebase/firestore";

export interface CartItem {
  id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart", user?.uid],
    queryFn: async () => {
      if (!user) return [];

      const q = query(
        collection(db, "cart_items"),
        where("user_id", "==", user.uid)
        // Note: Firestore requires an index for compound queries with orderBy, 
        // so we might handle sorting in the client if index is missing.
        // For now, let's sort in client to avoid need for immediate index creation.
      );

      const querySnapshot = await getDocs(q);
      const items: CartItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          product_name: data.product_name,
          product_image: data.product_image,
          price: data.price,
          quantity: data.quantity
        });
      });

      // Sort by created_at if available or just consistent order
      // Assuming we prefer recent items, but without timestamp field in new items they might be jumbled
      // We will add created_at on insert.
      return items;
    },
    enabled: !!user,
  });

  const addToCart = useMutation({
    mutationFn: async ({
      productName,
      productImage,
      price,
      quantity = 1,
    }: {
      productName: string;
      productImage?: string;
      price: number;
      quantity?: number;
    }) => {
      if (!user) throw new Error("Vous devez être connecté");

      // Check if item already exists
      const q = query(
        collection(db, "cart_items"),
        where("user_id", "==", user.uid),
        where("product_name", "==", productName)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update quantity of the first matching doc
        const existingDoc = querySnapshot.docs[0];
        const currentQuantity = existingDoc.data().quantity;

        await updateDoc(doc(db, "cart_items", existingDoc.id), {
          quantity: currentQuantity + quantity
        });
      } else {
        // Insert new item
        await addDoc(collection(db, "cart_items"), {
          user_id: user.uid,
          product_name: productName,
          product_image: productImage || null,
          price,
          quantity,
          created_at: Timestamp.now()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.uid] });
      toast.success("Produit ajouté au panier");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (!user) throw new Error("Vous devez être connecté");

      if (quantity <= 0) {
        await deleteDoc(doc(db, "cart_items", id));
      } else {
        await updateDoc(doc(db, "cart_items", id), {
          quantity
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.uid] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Vous devez être connecté");
      await deleteDoc(doc(db, "cart_items", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.uid] });
      toast.success("Produit retiré du panier");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Vous devez être connecté");

      // Firestore doesn't support "delete all", so we query and delete batch/each
      const q = query(
        collection(db, "cart_items"),
        where("user_id", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, "cart_items", d.id)));
      await Promise.all(deletePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.uid] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  };
}
