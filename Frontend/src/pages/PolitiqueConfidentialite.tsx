import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
const PolitiqueConfidentialite = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index: any) => {
    setOpenSection(openSection === index ? null : index);
  };

  const privacyPolicyContent = [
    {
      title: "Introduction",
      content:
        "Nous prenons votre vie privée au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.",
    },
    {
      title: "Informations Collectées",
      content:
        "Nous collectons des informations personnelles telles que votre nom, adresse e-mail, et historique d'achat pour améliorer votre expérience sur notre site.",
    },
    {
      title: "Utilisation des Informations",
      content:
        "Les informations collectées sont utilisées pour traiter vos commandes, améliorer nos services, et vous envoyer des communications marketing si vous avez opté pour les recevoir.",
    },
    {
      title: "Partage des Informations",
      content:
        "Nous ne partageons vos informations personnelles avec des tiers que lorsque cela est nécessaire pour traiter vos commandes ou comme exigé par la loi.",
    },
    {
      title: "Sécurité",
      content:
        "Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre l'accès non autorisé, l'altération, la divulgation ou la destruction.",
    },
    {
      title: "Cookies",
      content:
        "Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez choisir de désactiver les cookies dans les paramètres de votre navigateur.",
    },
    {
      title: "Modifications de la Politique",
      content:
        "Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page.",
    },
    {
      title: "Contact",
      content:
        "Pour toute question concernant notre politique de confidentialité, veuillez nous contacter à l'adresse suivante : contact@archideco.com.",
    },
  ];

  return (
    <div className="bg-slate-100 w-full min-h-screen text-black">
      <Navbar />

      <section className="w-full py-12 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-green-emerald text-center mb-8">
            Politique de Confidentialité
          </h1>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {privacyPolicyContent.map((item, index) => (
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
