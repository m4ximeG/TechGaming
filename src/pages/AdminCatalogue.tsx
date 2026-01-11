import { useState } from "react";
import { useProducts, Product, ProductFormData, SOCKETS, RAM_TYPES, FORMATS, STORAGE_TYPES } from "@/hooks/useProducts";
import { useAdmin } from "@/hooks/useAdmin";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

const AdminCatalogue = () => {
    const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
    const { isAdmin, loading: adminLoading } = useAdmin();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        category: "gpu",
        price: 0,
        originalPrice: null,
        image: "",
        badge: null,
        inStock: true,
        allowInConfigurator: false,
    });

    // 1. Loading State for Admin Check
    if (adminLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 2. Access Denied State
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Accès Refusé</h1>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                    Vous n'avez pas les droits administrateur nécessaires pour accéder à cette page.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => navigate("/")} variant="outline">
                        Retour à l'accueil
                    </Button>
                    <Button onClick={() => navigate("/compte")}>
                        Se connecter
                    </Button>
                </div>
            </div>
        );
    }

    // Helper functions
    const resetForm = () => {
        setFormData({
            name: "",
            category: "gpu",
            price: 0,
            originalPrice: null,
            image: "",
            badge: null,
            inStock: true,
            allowInConfigurator: false,
            compatibility: {},
        });
        setEditingProduct(null);
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            badge: product.badge,
            inStock: product.inStock,
            allowInConfigurator: product.allowInConfigurator || false,
            compatibility: product.compatibility || {},
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await updateProduct.mutateAsync({
                    id: editingProduct.id,
                    data: formData
                });
            } else {
                await addProduct.mutateAsync(formData);
            }

            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error submitting product:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            await deleteProduct.mutateAsync(id);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <main className="pt-24 pb-16 container mx-auto px-4 lg:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Administration Catalogue</h1>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="btn-gaming flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Ajouter un produit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom du produit</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="gpu">Carte Graphique</option>
                                        <option value="cpu">Processeur</option>
                                        <option value="ram">RAM</option>
                                        <option value="stockage">Stockage</option>
                                        <option value="motherboard">Carte Mère</option>
                                        <option value="psu">Alimentation</option>
                                        <option value="case">Boitier</option>
                                        <option value="cooling">Refroidissement</option>
                                        <option value="pc-gamer">PC Gamer</option>
                                        <option value="peripheriques">Périphériques</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Prix</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="originalPrice">Prix d'origine (Optionnel)</Label>
                                        <Input
                                            id="originalPrice"
                                            type="number"
                                            value={formData.originalPrice || ""}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : null })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">URL de l'image</Label>
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        required
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="badge">Badge (Optionnel)</Label>
                                    <Input
                                        id="badge"
                                        value={formData.badge || ""}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value || null })}
                                        placeholder="Ex: Nouveau, Promo..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Switch
                                                id="inStock"
                                                checked={formData.inStock}
                                                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                                            />
                                            <Label htmlFor="inStock">En stock</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Switch
                                                id="allowInConfigurator"
                                                checked={formData.allowInConfigurator}
                                                onCheckedChange={(checked) => setFormData({ ...formData, allowInConfigurator: checked })}
                                            />
                                            <Label htmlFor="allowInConfigurator">Dans Configurateur</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Compatibility Fields - Show ONLY if in Configurator */}
                                {formData.allowInConfigurator && (
                                    <div className="border border-primary/20 bg-primary/5 p-4 rounded-lg space-y-4">
                                        <h3 className="font-semibold text-primary">Données techniques (Obligatoire)</h3>

                                        {/* CPU */}
                                        {formData.category === 'cpu' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Socket</Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.compatibility?.socket || ""}
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, socket: e.target.value as any } })}
                                                        required
                                                    >
                                                        <option value="">Sélectionner...</option>
                                                        {SOCKETS.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>TDP (Watts)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.compatibility?.tdp || ""}
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, tdp: Number(e.target.value) } })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Motherboard */}
                                        {formData.category === 'motherboard' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Socket</Label>
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={formData.compatibility?.socket || ""}
                                                            onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, socket: e.target.value as any } })}
                                                            required
                                                        >
                                                            <option value="">Sélectionner...</option>
                                                            {SOCKETS.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Format</Label>
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={formData.compatibility?.format || ""}
                                                            onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, format: e.target.value as any } })}
                                                            required
                                                        >
                                                            <option value="">Sélectionner...</option>
                                                            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Type de RAM</Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.compatibility?.ramType || ""}
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, ramType: e.target.value as any } })}
                                                        required
                                                    >
                                                        <option value="">Sélectionner...</option>
                                                        {RAM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* RAM */}
                                        {formData.category === 'ram' && (
                                            <div className="space-y-2">
                                                <Label>Type de RAM</Label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={formData.compatibility?.ramType || ""}
                                                    onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, ramType: e.target.value as any } })}
                                                    required
                                                >
                                                    <option value="">Sélectionner...</option>
                                                    {RAM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {/* GPU */}
                                        {formData.category === 'gpu' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Longueur (mm)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.compatibility?.length || ""}
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, length: Number(e.target.value) } })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Puissance Recommandée (W)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.compatibility?.recommendedPower || ""}
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, recommendedPower: Number(e.target.value) } })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Case */}
                                        {formData.category === 'case' && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Longueur GPU Max (mm)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.compatibility?.maxGpuLength || ""}
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, maxGpuLength: Number(e.target.value) } })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Formats Supportés (Maintenez Ctrl/Cmd pour plusieurs)</Label>
                                                    <select
                                                        multiple
                                                        className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.compatibility?.supportedFormats || []}
                                                        onChange={(e) => {
                                                            const options = Array.from(e.target.selectedOptions, option => option.value);
                                                            setFormData({ ...formData, compatibility: { ...formData.compatibility, supportedFormats: options } });
                                                        }}
                                                        required
                                                    >
                                                        {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* PSU */}
                                        {formData.category === 'psu' && (
                                            <div className="space-y-2">
                                                <Label>Puissance (Watts)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.compatibility?.wattage || ""}
                                                    onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, wattage: Number(e.target.value) } })}
                                                    required
                                                />
                                            </div>
                                        )}

                                        {/* Storage */}
                                        {formData.category === 'stockage' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Type</Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.compatibility?.format || ""} // Reusing format/type field or creating new? Schema technically has no 'storageType' but 'format' can work or I should add 'storageType' to schema.
                                                        // Let's use 'format' for now as it's a string, or just add a generic type field.
                                                        // The constant is STORAGE_TYPES.
                                                        // I'll bind it to 'storageType' if I add it to schema, OR just map it to 'format' for simplicity since DB is schemaless, but TS interface needs update.
                                                        // Let's check useProducts.ts schema again.
                                                        // I did NOT add storageType. I have 'format'. M.2 is a format.
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, format: e.target.value as any } })}
                                                        required
                                                    >
                                                        <option value="">Sélectionner...</option>
                                                        {STORAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Capacité (Go)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.compatibility?.capacity || ""}
                                                        onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, capacity: Number(e.target.value) } })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Cooling */}
                                        {formData.category === 'cooling' && (
                                            <div className="space-y-2">
                                                <Label>Socket (Si applicable)</Label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={formData.compatibility?.socket || ""}
                                                    onChange={(e) => setFormData({ ...formData, compatibility: { ...formData.compatibility, socket: e.target.value as any } })}
                                                >
                                                    <option value="">Universel / Autre</option>
                                                    {SOCKETS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Button type="submit" className="w-full btn-gaming">
                                    {editingProduct ? "Mettre à jour" : "Ajouter"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mb-6">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un produit..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead>Badge</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">Chargement...</TableCell>
                                </TableRow>
                            ) : filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">Aucun produit trouvé</TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product.name}
                                            {product.allowInConfigurator && (
                                                <span title="Disponible dans le configurateur" className="ml-2 inline-block">
                                                    <span className="sr-only">Configurateur</span>
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="uppercase text-xs">{product.category}</TableCell>
                                        <TableCell>{product.price}€</TableCell>
                                        <TableCell>{product.badge || "-"}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                                {product.inStock ? "Oui" : "Non"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminCatalogue;
