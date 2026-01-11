import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Zap, Shield } from "lucide-react";
import heroImage from "@/assets/hero-gaming.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Gaming PC Setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Nouveau : RTX 5090 disponible
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gaming-hero mb-6"
          >
            Équipez-vous pour{" "}
            <span className="text-gradient">dominer</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            Découvrez notre sélection de composants haut de gamme pour créer le setup gaming de vos rêves. PC Gamers, GPU, RAM et plus encore.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link to="/catalogue">
              <Button size="lg" className="btn-gaming text-base px-8 h-12 font-semibold">
                <span className="relative z-10 flex items-center gap-2">
                  Voir le catalogue
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
            <Link to="/configurateur">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 font-semibold border-primary/50 hover:bg-primary/10 hover:border-primary"
              >
                <Cpu className="w-5 h-5 mr-2" />
                Monter mon PC
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: Shield, label: "Garantie 2 ans" },
              { icon: Zap, label: "Livraison express" },
              { icon: Cpu, label: "Support technique" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
