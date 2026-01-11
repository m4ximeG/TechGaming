import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 lg:px-6 py-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">1. Collecte des données</h2>
                        <p className="text-muted-foreground">
                            Nous collectons les informations que vous nous fournissez notamment lorsque :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                            <li>Vous créez un compte client</li>
                            <li>Vous effectuez une commande</li>
                            <li>Vous naviguez sur notre site (cookies)</li>
                            <li>Vous contactez notre service client</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">2. Utilisation des données</h2>
                        <p className="text-muted-foreground">
                            Vos données sont destinées à TechGaming pour :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                            <li>Gérer vos commandes et la livraison</li>
                            <li>Vous envoyer des offres commerciales (si accepté)</li>
                            <li>Améliorer votre expérience utilisateur</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">3. Vos droits</h2>
                        <p className="text-muted-foreground">
                            Conformément à la loi "Informatique et Libertés" et au RGPD, vous disposez d'un droit d'accès, de rectification, et d'effacement de vos données.
                            Pour exercer ces droits, contactez-nous à : <strong>contact@techgaming.fr</strong>.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PolitiqueConfidentialite;
