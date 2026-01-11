import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Monitor, Cpu, MemoryStick, HardDrive, Gamepad2, Headphones, Box, Power, Fan } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useMemo } from "react";

// Configuration for all possible categories
const categoryConfig: Record<string, {
  name: string;
  description: string;
  icon: any;
  gradient: string;
}> = {
  "pc-gamer": {
    name: "PC Gamer",
    description: "Configurations complètes prêtes à jouer",
    icon: Monitor,
    gradient: "from-blue-500 to-cyan-500",
  },
  "gpu": {
    name: "Cartes Graphiques",
    description: "NVIDIA RTX & AMD Radeon",
    icon: Gamepad2,
    gradient: "from-green-500 to-emerald-500",
  },
  "cpu": {
    name: "Processeurs",
    description: "Intel Core & AMD Ryzen",
    icon: Cpu,
    gradient: "from-purple-500 to-pink-500",
  },
  "ram": {
    name: "Mémoire RAM",
    description: "DDR4 & DDR5 haute performance",
    icon: MemoryStick,
    gradient: "from-orange-500 to-red-500",
  },
  "storage": {
    name: "Stockage",
    description: "SSD NVMe & HDD",
    icon: HardDrive,
    gradient: "from-yellow-500 to-amber-500",
  },
  "motherboard": {
    name: "Cartes Mères",
    description: "ATX, Micro-ATX, Mini-ITX",
    icon: Box, // Using Box as placeholder for Motherboard if needed, or stick to Box/Cpu
    gradient: "from-indigo-500 to-purple-500",
  },
  "psu": {
    name: "Alimentations",
    description: "Modulaires & Certifiées",
    icon: Power,
    gradient: "from-gray-500 to-slate-500",
  },
  "case": {
    name: "Boîtiers",
    description: "Tours Gaming & RGB",
    icon: Box,
    gradient: "from-zinc-500 to-neutral-500",
  },
  "cooling": {
    name: "Refroidissement",
    description: "Ventirads & Watercooling",
    icon: Fan,
    gradient: "from-cyan-500 to-blue-500",
  },
  "peripheriques": {
    name: "Périphériques",
    description: "Claviers, souris, casques",
    icon: Headphones,
    gradient: "from-indigo-500 to-violet-500",
  },
};

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

const Categories = () => {
  const { products } = useProducts();

  const categories = useMemo(() => {
    // 1. Calculate counts
    const counts: Record<string, number> = {};
    products.forEach(product => {
      const cat = product.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // 2. Map to display objects, filtering out empty ones
    return Object.entries(categoryConfig)
      .map(([key, config]) => ({
        id: key,
        ...config,
        count: counts[key] || 0,
      }))
      .filter(cat => cat.count > 0);
  }, [products]);

  if (categories.length === 0) {
    return null; // Or return a "Loading" / "No categories" state if preferred
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explorez nos <span className="text-gradient">catégories</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trouvez les meilleurs composants pour votre configuration gaming
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to={`/catalogue?category=${category.id}`}
                className="group gaming-card block p-6 h-full"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {category.description}
                    </p>
                    <span className="text-xs text-primary font-medium">
                      {category.count} produits
                    </span>
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

export default Categories;
