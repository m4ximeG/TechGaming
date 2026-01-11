import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useAdmin() {
    const { user, loading: authLoading } = useAuth();

    const { data: isAdmin = false, isLoading: queryLoading } = useQuery({
        queryKey: ["isAdmin", user?.uid],
        queryFn: async () => {
            if (!user) return false;

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("User data:", userData); // Debugging
                    return userData.isAdmin === true;
                }
                return false;
            } catch (error) {
                console.error("Error checking admin status:", error);
                return false;
            }
        },
        enabled: !!user,
    });

    return {
        isAdmin,
        loading: authLoading || queryLoading
    };
}
