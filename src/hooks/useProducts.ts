import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/integrations/firebase/client";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { toast } from "sonner";

// Hardware Constants
export const SOCKETS = ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851'] as const;
export const RAM_TYPES = ['DDR4', 'DDR5'] as const;
export const FORMATS = ['ATX', 'Micro-ATX', 'Mini-ITX'] as const;
export const STORAGE_TYPES = ['M.2 NVMe', 'SATA SSD', 'HDD 3.5'] as const;

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number | null;
    rating: number;
    reviewCount: number;
    image: string;
    badge?: string | null;
    inStock: boolean;
    description?: string;
    allowInConfigurator?: boolean;
    compatibility?: {
        // Generic / Shared
        brand?: string;

        // CPU
        socket?: typeof SOCKETS[number];
        tdp?: number; // Watts

        // Motherboard
        chipset?: string;
        ramType?: typeof RAM_TYPES[number];
        format?: typeof FORMATS[number];
        m2Slots?: number;

        // RAM
        capacity?: number; // GB
        frequency?: number; // MHz

        // GPU
        length?: number; // mm
        recommendedPower?: number; // Watts

        // Case
        maxGpuLength?: number; // mm
        supportedFormats?: string[]; // ATX, Micro-ATX...

        // PSU
        wattage?: number; // Watts
        modularity?: string;

        // Cooling
        radiatorSize?: number; // 120, 240, 360
        maxHeight?: number; // mm (for Air)
    };
}

export type ProductFormData = Omit<Product, "id" | "rating" | "reviewCount"> & {
    rating?: number;
    reviewCount?: number;
};

export function useProducts() {
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const q = query(collection(db, "products")); // You can add orderBy here if you add an index
            const querySnapshot = await getDocs(q);
            const items: Product[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    name: data.name,
                    category: data.category,
                    price: data.price,
                    originalPrice: data.originalPrice,
                    rating: data.rating || 0,
                    reviewCount: data.reviewCount || 0,
                    image: data.image,
                    badge: data.badge,
                    inStock: data.inStock !== undefined ? data.inStock : true,
                    description: data.description,
                    allowInConfigurator: data.allowInConfigurator || false,
                    compatibility: data.compatibility || {}
                });
            });
            return items;
        },
    });

    const addProduct = useMutation({
        mutationFn: async (data: ProductFormData) => {
            await addDoc(collection(db, "products"), {
                ...data,
                rating: data.rating || 5, // Default new products to 5 stars or 0
                reviewCount: data.reviewCount || 0,
                createdAt: Timestamp.now()
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Produit ajouté avec succès");
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        },
    });

    const updateProduct = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
            await updateDoc(doc(db, "products", id), {
                ...data,
                updatedAt: Timestamp.now()
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Produit mis à jour");
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        },
    });

    const deleteProduct = useMutation({
        mutationFn: async (id: string) => {
            await deleteDoc(doc(db, "products", id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Produit supprimé");
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        },
    });

    return {
        products,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
    };
}
