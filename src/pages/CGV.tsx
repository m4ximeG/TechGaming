import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CGV = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 lg:px-6 py-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold mb-8">Conditions Générales de Vente (CGV)</h1>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">1. Objet</h2>
                        <p className="text-muted-foreground">
                            Les présentes Conditions Générales de Vente déterminent les droits et obligations des parties dans le cadre de la vente en ligne de produits proposés par TechGaming.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">2. Prix</h2>
                        <p className="text-muted-foreground">
                            Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC), sauf indication contraire et hors frais de traitement et d'expédition.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">3. Commandes</h2>
                        <p className="text-muted-foreground">
                            Vous pouvez passer commande sur notre site internet. Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">4. Livraison</h2>
                        <p className="text-muted-foreground">
                            Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande. Les délais de livraison ne sont donnés qu'à titre indicatif.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">5. Retours et Remboursements</h2>
                        <p className="text-muted-foreground">
                            Vous disposez d'un délai légal de 14 jours pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CGV;
