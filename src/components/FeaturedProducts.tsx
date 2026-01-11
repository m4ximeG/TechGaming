import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Zap } from "lucide-react";

// Temporary mock data - will be replaced with database data
const featuredProducts = [
  {
    id: "1",
    name: "RTX 5090 Founders Edition",
    category: "Carte Graphique",
    price: 2199,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
    badge: "Nouveau",
    inStock: true,
  },
  {
    id: "2",
    name: "AMD Ryzen 9 9950X",
    category: "Processeur",
    price: 649,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop",
    badge: null,
    inStock: true,
  },
  {
    id: "3",
    name: "Corsair Dominator DDR5 64GB",
    category: "Mémoire RAM",
    price: 289,
    originalPrice: 349,
    rating: 4.7,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop",
    badge: "Promo",
    inStock: true,
  },
  {
    id: "4",
    name: "Samsung 990 Pro 4TB",
    category: "Stockage",
    price: 399,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop",
    badge: null,
    inStock: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Produits <span className="text-gradient">populaires</span>
            </h2>
            <p className="text-muted-foreground">
              Les composants les plus demandés par notre communauté
            </p>
          </div>
          <Link to="/catalogue">
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
              Voir tout le catalogue
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Link
                to={`/produit/${product.id}`}
                className="group gaming-card block overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === "Nouveau" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-destructive text-destructive-foreground"
                    }`}>
                      {product.badge === "Nouveau" && <Zap className="w-3 h-3 inline mr-1" />}
                      {product.badge}
                    </div>
                  )}
                  {/* Out of Stock Overlay */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-muted-foreground font-medium">Rupture de stock</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} avis)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        {product.price}€
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}€
                        </span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                      disabled={!product.inStock}
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to cart logic will be added later
                      }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
