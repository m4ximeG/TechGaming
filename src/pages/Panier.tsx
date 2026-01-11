import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

const Panier = () => {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, isLoading, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const total = cartTotal + shipping;

  const handleUpdateQuantity = (id: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    updateQuantity.mutate({ id, quantity: newQty });
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart.mutate(id);
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "gaming10") {
      toast.success("Code promo appliqué !", { description: "-10% sur votre commande" });
    } else {
      toast.error("Code promo invalide");
    }
    setPromoCode("");
  };

  const handleCheckout = () => {
    toast.success("Commande simulée avec succès !", {
      description: "Redirection vers le paiement...",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <LogIn className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Connectez-vous pour voir votre panier</h1>
              <p className="text-muted-foreground mb-8">
                Votre panier est sauvegardé et accessible depuis tous vos appareils.
              </p>
              <Link to="/compte">
                <Button className="btn-gaming">
                  <span className="relative z-10 flex items-center gap-2">
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
              <p className="text-muted-foreground mb-8">
                Découvrez notre catalogue et ajoutez des produits à votre panier.
              </p>
              <Link to="/catalogue">
                <Button className="btn-gaming">
                  <span className="relative z-10 flex items-center gap-2">
                    Voir le catalogue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Votre <span className="text-gradient">Panier</span>
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="gaming-card p-4 flex gap-4"
                >
                  <img
                    src={item.product_image || "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop"}
                    alt={item.product_name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mt-1 truncate">{item.product_name}</h3>
                    <p className="text-xl font-bold text-primary mt-2">
                      {item.price}€
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeFromCart.isPending}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        disabled={updateQuantity.isPending}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        disabled={updateQuantity.isPending}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="gaming-card p-6 sticky top-24"
              >
                <h3 className="text-xl font-bold mb-6">Récapitulatif</h3>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Code promo</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Entrez votre code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyPromo}>
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{cartTotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className={shipping === 0 ? "text-green-500" : ""}>
                      {shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)}€`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite dès 100€ d'achat
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gradient">{total.toFixed(2)}€</span>
                </div>

                <Button
                  size="lg"
                  className="w-full btn-gaming mb-4"
                  onClick={handleCheckout}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Passer commande
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Paiement sécurisé par Stripe (bientôt disponible)
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Panier;
