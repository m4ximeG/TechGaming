import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, MemoryStick, Monitor, Fan, Power, Box, Check, AlertTriangle, ShoppingCart, Info, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, Product } from "@/hooks/useProducts";

// Helper to safely parse string array if it comes as string (legacy data protection)
const getSupportedFormats = (formats: string | string[] | undefined): string[] => {
  if (Array.isArray(formats)) return formats;
  if (typeof formats === 'string') return [formats];
  return [];
};

const componentConfig = [
  { key: "cpu", label: "Processeur", icon: Cpu },
  { key: "motherboard", label: "Carte Mère", icon: Box },
  { key: "ram", label: "Mémoire RAM", icon: MemoryStick },
  { key: "gpu", label: "Carte Graphique", icon: Monitor },
  { key: "stockage", label: "Stockage", icon: HardDrive },
  { key: "psu", label: "Alimentation", icon: Power },
  { key: "case", label: "Boîtier", icon: Box },
  { key: "cooling", label: "Refroidissement", icon: Fan },
];

const Configurateur = () => {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();

  const getProduct = (id: string) => products.find(p => p.id === id);

  // --- Derived State: Selected Objects ---
  const selectedCpu = selectedComponents["cpu"] ? getProduct(selectedComponents["cpu"]) : null;
  const selectedMobo = selectedComponents["motherboard"] ? getProduct(selectedComponents["motherboard"]) : null;
  const selectedGpu = selectedComponents["gpu"] ? getProduct(selectedComponents["gpu"]) : null;
  const selectedCase = selectedComponents["case"] ? getProduct(selectedComponents["case"]) : null;
  const selectedRam = selectedComponents["ram"] ? getProduct(selectedComponents["ram"]) : null;
  const selectedPsu = selectedComponents["psu"] ? getProduct(selectedComponents["psu"]) : null;

  // --- Power Calculation ---
  const estimatedPower = useMemo(() => {
    let watts = 0;
    if (selectedCpu?.compatibility?.tdp) watts += selectedCpu.compatibility.tdp;
    // GPU often lists "Recommended PSU" which is safer to use than TGP
    if (selectedGpu?.compatibility?.recommendedPower) watts += (selectedGpu.compatibility.recommendedPower * 0.6); // Crude approximation if using Rec. Power which is usually total system
    // Or if we had strict GPU consumption data. Let's assume standard overhead:
    // Base system (Mobo, RAM, Fans, SSD) ~ 100W
    watts += 100;

    // If GPU has specific consumption (not currently in schema, we used recommendedPower for simplicity)
    // Let's rely on the "Recommended Power" being the guide for the PSU selection, 
    // but for the meter we need an estimated DRAW.
    // Let's treat recommendedPower as a high-water mark for the PSU matching, not draw.
    // For draw: CPU TDP + (GPU Rec / 1.5 approx) is a heuristic.
    return Math.round(watts);
  }, [selectedCpu, selectedGpu]);

  // --- Compatibility Engine ---
  const componentOptions = useMemo(() => {
    const options: Record<string, Product[]> = {};
    componentConfig.forEach(config => options[config.key] = []);

    products.forEach(product => {
      if (!product.allowInConfigurator) return;

      let isCompatible = true;
      const comp = product.compatibility || {};

      switch (product.category) {
        case "motherboard":
          // Rule: Mobo Socket must match CPU Socket
          if (selectedCpu?.compatibility?.socket) {
            if (comp.socket !== selectedCpu.compatibility.socket) isCompatible = false;
          }
          break;

        case "ram":
          // Rule: RAM Type must match Mobo RAM Type
          if (selectedMobo?.compatibility?.ramType) {
            if (comp.ramType !== selectedMobo.compatibility.ramType) isCompatible = false;
          }
          // Fallback: If no Mobo but CPU selected, maybe hint by CPU? (Intel 12/13/14 support both, AMD AM5 only DDR5).
          // Easier to rely on Mobo.
          break;

        case "case":
          // Rule 1: Case must support Mobo Format
          if (selectedMobo?.compatibility?.format) {
            const supported = getSupportedFormats(comp.supportedFormats);
            if (!supported.includes(selectedMobo.compatibility.format)) isCompatible = false;
          }
          // Rule 2: Case must fit GPU Length
          if (selectedGpu?.compatibility?.length && comp.maxGpuLength) {
            if (selectedGpu.compatibility.length > comp.maxGpuLength) isCompatible = false;
          }
          break;

        case "gpu":
          // Rule: GPU Length must fit in selected Case (Bidirectional check)
          if (selectedCase?.compatibility?.maxGpuLength && comp.length) {
            if (comp.length > selectedCase.compatibility.maxGpuLength) isCompatible = false;
          }
          break;

        case "psu":
          // Rule: PSU Wattage >= Estimated Load + Headroom
          // A safer check is: PSU Wattage >= GPU Recommended Power (if GPU selected)
          if (selectedGpu?.compatibility?.recommendedPower && comp.wattage) {
            if (comp.wattage < selectedGpu.compatibility.recommendedPower) isCompatible = false;
          }
          break;

        case "cooling":
          // Rule: Socket support
          if (selectedCpu?.compatibility?.socket && comp.socket) {
            if (comp.socket !== selectedCpu.compatibility.socket) isCompatible = false;
          }
          break;
      }

      if (isCompatible) {
        if (!options[product.category]) options[product.category] = [];
        options[product.category].push(product);
      }
    });

    return options;
  }, [products, selectedCpu, selectedMobo, selectedGpu, selectedCase]);


  // --- Auto-Reset Logic to prevent invalid states ---
  useEffect(() => {
    // If Socket changes, Mobo is invalid
    if (selectedCpu && selectedMobo && selectedCpu.compatibility?.socket !== selectedMobo.compatibility?.socket) {
      const { motherboard, ram, ...rest } = selectedComponents; // Also kill RAM as it depends on Mobo
      setSelectedComponents(rest);
      toast.warning("Carte mère retirée : Incompatible avec le nouveau processeur.");
    }
  }, [selectedComponents.cpu]);

  useEffect(() => {
    // If Mobo changes (e.g. DDR4 -> DDR5), Check RAM
    if (selectedMobo && selectedRam && selectedMobo.compatibility?.ramType !== selectedRam.compatibility?.ramType) {
      const { ram, ...rest } = selectedComponents;
      setSelectedComponents(rest);
      toast.warning("RAM retirée : Incompatible avec la nouvelle carte mère.");
    }
  }, [selectedComponents.motherboard]);

  // --- Handlers ---
  const handleSelectComponent = (category: string, componentId: string) => {
    setSelectedComponents((prev) => ({ ...prev, [category]: componentId }));
  };

  const totalPrice = Object.keys(selectedComponents).reduce((acc, category) => {
    const component = products.find(p => p.id === selectedComponents[category]);
    return acc + (component?.price || 0);
  }, 0);

  const selectedCount = Object.keys(selectedComponents).length;
  const isComplete = selectedCount === componentConfig.length;

  const handleAddToCart = () => {
    if (!isComplete) return;
    if (!user) {
      navigate("/compte");
      return;
    }
    const configName = `PC Gamer Custom (${selectedCpu?.name || 'Config'})`;
    addToCart.mutate({ productName: configName, price: totalPrice });
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16 px-4 container mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Configurateur <span className="text-gradient">Pro</span></h1>
          <p className="text-muted-foreground">Compatibilité matérielle vérifiée automatiquement.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-4">
            {componentConfig.map((config) => {
              const options = componentOptions[config.key] || [];
              const selected = products.find(p => p.id === selectedComponents[config.key]);

              // Detailed Labels for Technical Specs
              const getSpecs = (p: Product) => {
                const c = p.compatibility;
                if (!c) return "";
                switch (p.category) {
                  case 'cpu': return `${c.socket} | ${c.tdp}W`;
                  case 'motherboard': return `${c.socket} | ${c.ramType} | ${c.format}`;
                  case 'ram': return `${c.ramType} | ${c.frequency}MHz`;
                  case 'gpu': return `${c.length}mm | PSU ${c.recommendedPower}W`;
                  case 'case': return `GPU Max ${c.maxGpuLength}mm`;
                  case 'psu': return `${c.wattage}W`;
                  default: return "";
                }
              };

              return (
                <motion.div key={config.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className={`gaming-card overflow-hidden ${selected ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <config.icon className="w-6 h-6 text-primary" />
                      </div>

                      {/* Label */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-semibold">{config.label}</h3>
                        {selected ? (
                          <div className="text-sm">
                            <span className="font-medium text-foreground">{selected.name}</span>
                            <span className="text-xs text-muted-foreground block">{getSpecs(selected)}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Non sélectionné</p>
                        )}
                      </div>

                      {/* Selector */}
                      <div className="w-full md:w-64">
                        <Select value={selectedComponents[config.key] || ""} onValueChange={(v) => handleSelectComponent(config.key, v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent>
                            {options.length > 0 ? options.map(opt => (
                              <SelectItem key={opt.id} value={opt.id}>
                                <div className="flex justify-between w-full min-w-[200px] gap-4">
                                  <span className="truncate">{opt.name}</span>
                                  <span className="font-bold">{opt.price}€</span>
                                </div>
                              </SelectItem>
                            )) : (
                              <div className="p-2 text-sm text-muted-foreground text-center">Aucune option compatible</div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Power Meter */}
              <Card className="gaming-card">
                <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Puissance Estimée</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold">{estimatedPower}W</span>
                    {selectedPsu?.compatibility?.wattage && (
                      <span className={`text-sm ${selectedPsu.compatibility.wattage >= estimatedPower ? 'text-green-500' : 'text-red-500'}`}>
                        / PSU {selectedPsu.compatibility.wattage}W
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${selectedPsu && selectedPsu.compatibility?.wattage && estimatedPower > selectedPsu.compatibility.wattage ? 'bg-red-500' : 'bg-yellow-500'}`}
                      style={{ width: selectedPsu?.compatibility?.wattage ? `${Math.min((estimatedPower / selectedPsu.compatibility.wattage) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Total & Action */}
              <Card className="gaming-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-gradient">{totalPrice}€</span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full btn-gaming"
                    disabled={!isComplete}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au panier
                  </Button>
                  {!isComplete && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-warning">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Configuration incomplète</span>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Configurateur;
