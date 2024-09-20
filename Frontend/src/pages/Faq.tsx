import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Faq = () => {
  const faqs = [
    {
      question:
        "Quels services propose Archideco en tant que revendeur officiel Mobalpa ?",
      answer:
        "En tant que revendeur officiel Mobalpa, Archideco propose une gamme complète de meubles de cuisine, salle de bain, et rangement sur mesure. Nous offrons également des services de conception, de conseil et d'installation pour assurer que chaque projet soit réalisé selon vos exigences.",
    },
    {
      question: "Quels types de petits électroménagers proposez-vous ?",
      answer:
        "Nous proposons une large sélection de petits électroménagers incluant des machines à café, des mixeurs, des robots de cuisine, et plus encore, issus de marques renommées comme Nespresso, Moulinex, et De'Longhi.",
    },
    {
      question: "Proposez-vous des produits gros électroménagers ?",
      answer:
        "Oui, Archideco offre une gamme de gros électroménagers tels que des réfrigérateurs, des lave-linges, des fours, et des lave-vaisselles de marques réputées comme Bosch, Siemens, et LG.",
    },
    {
      question:
        "Comment se passe la livraison et l'installation des produits ?",
      answer:
        "Nous offrons des services de livraison rapide et d'installation professionnelle pour tous nos produits. La livraison est gratuite pour les commandes au-dessus d'un certain montant. Nos équipes assurent que chaque installation est effectuée dans les règles de l'art.",
    },
    {
      question: "Quels sont les modes de paiement acceptés sur Archideco ?",
      answer:
        "Nous acceptons les paiements par carte bancaire (Visa, MasterCard, Amex), PayPal, ainsi que les virements bancaires. Toutes les transactions sont sécurisées grâce à un protocole de cryptage SSL.",
    },
    {
      question: "Comment puis-je contacter le service client ?",
      answer:
        "Notre service client est joignable par téléphone au 01 23 45 67 89, par email à support@archideco.com, ou via notre formulaire de contact en ligne. Nous sommes disponibles du lundi au vendredi, de 9h à 18h.",
    },
  ];

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-black flex flex-col justify-between">
      <Navbar />
      <section className="w-full py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-green-emerald mb-12">
            Foire Aux Questions
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-100 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105"
              >
                <h2 className="text-lg md:text-xl font-semibold text-green-duck mb-4">
                  {faq.question}
                </h2>
                <p className="text-base md:text-lg text-gray-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Faq;
