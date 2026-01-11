import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 lg:px-6 py-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">1. Édition du site</h2>
                        <p className="text-muted-foreground">
                            Le présent site, accessible à l'URL www.techgaming.fr (le « Site »), est édité par :
                        </p>
                        <p className="text-muted-foreground">
                            <strong>TechGaming</strong><br />
                            (Pied de page : Boutique en ligne uniquement)<br />
                            Email : contact@techgaming.fr<br />
                            Téléphone : 06 67 80 28 75
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">2. Hébergement</h2>
                        <p className="text-muted-foreground">
                            Le Site est hébergé par Vercel Inc., situé 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">3. Propriété intellectuelle</h2>
                        <p className="text-muted-foreground">
                            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">4. Données personnelles</h2>
                        <p className="text-muted-foreground">
                            Le traitement de vos données à caractère personnel est régi par notre Charte de Confidentialité, disponible depuis la section "Politique de confidentialité".
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MentionsLegales;
