import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const CgvCgu = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index: any) => {
    setOpenSection(openSection === index ? null : index);
  };

  const cgvContent = [
    {
      title: "Introduction",
      content:
        "Bienvenue sur Archideco. Les présentes conditions générales de vente régissent les ventes réalisées sur notre site.",
    },
    {
      title: "Produits et Services",
      content:
        "Nous proposons une gamme de produits allant des appareils électroménagers aux meubles de salle de bain, en passant par les équipements de cuisine.",
    },
    {
      title: "Prix et Disponibilité",
      content:
        "Les prix des produits sont indiqués en euros toutes taxes comprises. La disponibilité des produits est mise à jour régulièrement.",
    },
    {
      title: "Modes de Paiement",
      content:
        "Nous acceptons divers modes de paiement, y compris les cartes de crédit, les virements bancaires et les paiements en ligne sécurisés.",
    },
    {
      title: "Livraison et Retours",
      content:
        "Les frais de livraison sont calculés en fonction de la destination. Vous pouvez retourner les produits dans un délai de 14 jours après la réception.",
    },
    {
      title: "Responsabilités",
      content:
        "Nous nous efforçons de fournir des informations exactes, mais nous ne saurions être tenus responsables des erreurs ou omissions.",
    },
  ];

  const cguContent = [
    {
      title: "Introduction",
      content:
        "Ces conditions générales d'utilisation régissent l'accès et l'utilisation de notre site Web par les utilisateurs.",
    },
    {
      title: "Propriété Intellectuelle",
      content:
        "Tous les contenus du site, y compris les textes, images et logos, sont protégés par des droits de propriété intellectuelle.",
    },
    {
      title: "Responsabilités de l'Utilisateur",
      content:
        "L'utilisateur s'engage à utiliser le site de manière légale et à ne pas enfreindre les droits de tiers.",
    },
    {
      title: "Données Personnelles",
      content:
        "Nous collectons et traitons les données personnelles conformément à notre politique de confidentialité.",
    },
    {
      title: "Modifications du Site",
      content:
        "Nous nous réservons le droit de modifier le contenu du site à tout moment sans préavis.",
    },
    {
      title: "Contact",
      content:
        "Pour toute question concernant les CGU, veuillez nous contacter à l'adresse suivante : contact@archideco.com.",
    },
  ];

  return (
    <div className="bg-slate-100 w-full min-h-screen text-black">
      <Navbar />

      <section className="w-full py-12 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-green-emerald text-center mb-8">
            Conditions Générales de Vente (CGV) et Conditions Générales
            d’Utilisation (CGU)
          </h1>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-green-duck mb-4">
                Conditions Générales de Vente (CGV)
              </h2>
              {cgvContent.map((item, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    className="w-full flex items-center justify-between py-3 text-left font-medium text-gray-900 hover:text-green-emerald focus:outline-none"
                    onClick={() => toggleSection(index)}
                  >
                    <span>{item.title}</span>
                    {openSection === index ? (
                      <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                    )}
                  </button>
                  {openSection === index && (
                    <div className="pt-2 text-gray-700">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-green-duck mb-4">
                Conditions Générales d’Utilisation (CGU)
              </h2>
              {cguContent.map((item, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    className="w-full flex items-center justify-between py-3 text-left font-medium text-gray-900 hover:text-green-emerald focus:outline-none"
                    onClick={() => toggleSection(index + cgvContent.length)}
                  >
                    <span>{item.title}</span>
                    {openSection === index + cgvContent.length ? (
                      <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                    )}
                  </button>
                  {openSection === index + cgvContent.length && (
                    <div className="pt-2 text-gray-700">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CgvCgu;
