import { motion } from "framer-motion";
import { Star, Store, Link, MapPin, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const timelineEvents = [
  {
    year: "Février 2009",
    title: "Fondation d'Archideco",
    description:
      "Adaptation du processus pour le marché l'immobilier et 1er test effectué avec Century 21 Neuilly Plaisance",
    icon: <Star size={16} />,
  },
  {
    year: "Mars 2009",
    title: "Les prémices",
    description:
      "Les premiers signes d'un nouveau marché : le premier bien immobilier ayant bénéficié du premier projet test, voit le nombre d'appels augmenter de près de 30%, les visites sont plus nombreuses et l'appartement est vendu trois semaines après la mise en place du service. Le « Home Staging Virtuel® » était né et l'agence Century 21 Immobilière de Plaisance, dirigée par Mr Sébastien Bours , devient la première agence immobilière française à bénéficier de ce nouveau service. Depuis, les plus grands réseaux immobiliers sont devenus partenaires d'ArchiDeco, devenue la référence incontournable de la valorisation immobilière virtuelle",
    icon: <Store size={16} />,
  },
  {
    year: "Octobre 2010",
    title: "Partenaire Officiel de Mobalpa",
    description:
      "Après avoir signé, quelques semaines plus tôt, son premier partenariat national avec la franchise Century 21 France, le concept ArchiDeco / Home Staging Virtuel® est présenté, pour la première fois, en plénière devant tous les responsables français par le directeur de la communication Valéry de la Bouralière à l’atelier de management Century 21 au Palais du Pharo à Marseille.",
    icon: <Link size={16} />,
  },
  {
    year: "2011-2014",
    title: "Renouveau et avancer",
    description:
      "Signatures de partenariats avec les réseaux Century 21 Benelux, Solvimo, Laforêt Immobilier, Imogroup, L’Adresse, Square Habitat Centre Est, Agentys.",
    icon: <MapPin size={16} />,
  },
  {
    year: "Avril 2014",
    title: "LUn gros coup de pouce",
    description:
      "ArchiDeco réalise sa première levée de fond auprès du fond d’investissement « Impact Partenaires » pour financer son développement. « Le concept innovant, la culture d’entreprise et l’expertise ainsi que le niveau exceptionnel de satisfaction des clients nous ont convaincu du potentiel d’ArchiDeco» explique Abderzak Sifer, directeur d’investissement d’IMPACT partenaires.",
    icon: <Globe size={16} />,
  },
  {
    year: "Avril 2014",
    title: "Un nouveau partenair",
    description:
      "Participation aux Class’Affaire Guy Hoquet dans le cadre du lancement du partenariat avec cette même franchise.",
    icon: <Link size={16} />,
  },
];

export default function HistoirePage() {
  return (
    <div className="bg-slate-100 text-black">
      <Navbar />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-emerald text-center mb-12">
            L'Histoire d'Archideco
          </h1>
          <p className="text-lg text-gray-700 text-center mb-12">
            Depuis notre fondation, Archideco s'est engagé à transformer des
            espaces grâce à notre expertise en design d'intérieur. Découvrez
            notre voyage, nos réalisations, et notre collaboration avec Mobalpa.
          </p>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 border-l-2 border-green-emerald h-full"></div>
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative mb-16"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-emerald rounded-full flex items-center justify-center text-white">
                    {event.icon}
                  </div>
                  <div className="ml-4 text-green-duck font-semibold">
                    {event.year}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-16 bg-slate-100"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-emerald text-center mb-8">
            Nos magasin prés de chez vous !
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="./src/assets/mobalpa-magasin-aubagne.png"
                alt="Réalisations 1"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Aubagne</h3>
              <p className="text-gray-700">
                Description des réalisations ou des projets marquants
                d'Archideco.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="./src/assets/mobalpa-valentine.png"
                alt="Réalisations 2"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Marseille - La valentine
              </h3>
              <p className="text-gray-700">
                Description des réalisations ou des projets marquants
                d'Archideco.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="./src/assets/mobalpa-paradis.png"
                alt="Réalisations 3"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Marseille - Rue paradis
              </h3>
              <p className="text-gray-700">
                Description des réalisations ou des projets marquants
                d'Archideco.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-emerald text-center mb-8">
            Notre Partenaire Mobalpa
          </h2>
          <p className="text-lg text-gray-700 text-center mb-8">
            Nous sommes fiers d'être revendeur officiel de Mobalpa, une marque
            leader dans le domaine du design de cuisine, salle de bain et
            mobilier. Ensemble, nous offrons des produits de qualité supérieure
            à nos clients.
          </p>
          <div className="flex justify-center">
            <img
              src="./src/assets/mobalpa-histoire.png"
              alt="Mobalpa"
              className="h-24 object-contain"
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-16 bg-slate-100"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-emerald text-center mb-8">
            Témoignages de Clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 italic mb-4">
                "Archideco a transformé notre cuisine en un espace moderne et
                fonctionnel. Le service est impeccable et le résultat au-delà de
                nos attentes."
              </p>
              <p className="font-semibold text-gray-900">- Client Satisfait</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 italic mb-4">
                "Nous avons été ravis par la qualité des produits Mobalpa et
                l'expertise d'Archideco. Une équipe professionnelle et
                attentionnée."
              </p>
              <p className="font-semibold text-gray-900">- Client Heureux</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 italic mb-4">
                "Le processus de design avec Archideco a été fluide et agréable.
                Nous recommandons vivement leurs services à tous."
              </p>
              <p className="font-semibold text-gray-900">- Client Ravie</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-16 bg-green-emerald text-white text-center"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Réaliser Votre Projet ?
          </h2>
          <p className="text-lg mb-8">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins en
            design intérieur. Notre équipe est prête à vous aider à créer
            l'espace de vos rêves.
          </p>
          <a
            href="https://www.mobalpa.fr/me-rendre-en-magasin"
            target="_blank"
            className="bg-white text-green-emerald py-3 px-6 rounded-lg font-semibold"
          >
            Nous Contacter
          </a>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
