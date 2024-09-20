import Navbar from "../components/Navbar";
import Samsung from "../assets/machine.png";
import Oven from "../assets/four.png";
import Coffe from "../assets/coffe.png";
import Kitchen from "../assets/celeste.webp";
import Bathroom from "../assets/imperial.webp";
import LivingRoom from "../assets/purete.png";
import Lounge from "../assets/casual-black.png";
import Frigo from "../assets/frigo.png";
import Footer from "../components/Footer";
import {
  Document,
  Text,
  StyleSheet,
  Page,
  View,
  PDFViewer,
} from "@react-pdf/renderer";

import {
  Lightbulb,
  ShieldCheck,
  ArrowRightLeft,
  PackageCheck,
  Zap,
  Slash,
} from "lucide-react";
import Carousel from "../components/Carousel";
import { Link } from "react-router-dom";
import CardFixHomePage from "../components/CardFixHomePage";
import Assistant from "../components/Assistant";

export default function Home() {
  return (
    <div className="bg-slate-100 w-screen min-h-dvh h-auto text-black">
      <Navbar />
      <main className=" h-auto min-w-screen mt-6 px-4 flex flex-col gap-14">
        <Assistant />
        <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
          {[
            {
              title: "Machines à Laver & Sèche-linge",
              imgSrc: Samsung,
              alt: "Machines à Laver",
              badges: ["Samsung", "Electrolux", "Bosch", "Siemens", "LG"],
              bgColor: "bg-white",
              textColor: "text-white",
              borderColor: "border-black",
              link: "/products/gem",
            },
            {
              title: "Fours et Micro-ondes",
              imgSrc: Oven,
              alt: "Fours et Micro-ondes",
              badges: ["Samsung", "Electrolux", "Bosch", "Siemens", "LG"],
              bgColor: "bg-green-duck",
              textColor: "text-white",
              borderColor: "border-white",
              link: "/products/pem",
            },
            {
              title: "Machines à Café & Petit Électroménager",
              imgSrc: Coffe,
              alt: "Machines à Café",
              badges: ["Richard", "Nespresso", "De'Longhi", "Senseo", "Miele"],
              bgColor: "bg-green-duck",
              textColor: "text-white",
              borderColor: "border-white",
              link: "/products/pem",
            },
            {
              title: "Réfrigérateurs & Congélateurs",
              imgSrc: Frigo,
              alt: "Réfrigérateurs & Congélateurs",
              badges: ["Sub-Zero", "Bosch", "LG", "Viking", "Wolf"],
              bgColor: "bg-white",
              textColor: "text-white",
              borderColor: "border-black",
              link: "/products/gem",
            },
          ].map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`relative w-full max-w-2xl h-96 rounded-md overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 ${item.bgColor} ${item.borderColor} border hover:shadow-xl hover:cursor-pointer group`}
            >
              <img
                src={item.imgSrc}
                alt={item.alt}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-70 flex flex-col items-center justify-center p-4 transition-opacity duration-300">
                <h1
                  className={`text-2xl font-semibold text-center ${item.textColor} font-Aquawax group-hover:text-white group-hover:drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]`}
                >
                  {item.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {item.badges.map((badge, i) => (
                    <span
                      key={i}
                      className={`badge badge-md ${
                        item.textColor === "text-white"
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      } px-3 py-1 rounded-full`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="w-full bg-white  rounded-md py-10 px-4 grid gap-8 md:gap-6 text-sm">
          <h2 className="text-xl font-bold -translate-y-2 uppercase text-center">
            - Nos services Archideco -
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
              <ShieldCheck size={35} color="#639d87" />
              <p className="text-pretty font-semibold mt-2 md:mt-0 md:ml-4">
                Une garantie <span className="text-red-500">7 ans</span> sur
                tous nos produits
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
              <PackageCheck size={35} color="#639d87" />
              <p className="text-pretty font-semibold mt-2 md:mt-0 md:ml-4">
                Livraison, installation et mise en service
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
              <Lightbulb size={35} color="#639d87" />
              <p className="text-pretty font-semibold mt-2 md:mt-0 md:ml-4">
                Nos conseils achats, entretiens
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
              <ArrowRightLeft size={35} color="#639d87" />
              <p className="text-pretty font-semibold mt-2 md:mt-0 md:ml-4">
                Retour <span className="text-red-500">gratuit</span> en magasin
              </p>
            </div>
          </div>
        </section>

        <section className="w-full h-auto bg-white rounded-md py-6">
          <h2 className="text-black text-2xl font-bold text-center font-Aquawax py-6">
            - Nos incontournables du moment -
          </h2>
          <Carousel type="items" />
        </section>

        <section className="w-full h-auto py-4 rounded-md">
          <h2 className="text-red-500 text-2xl font-bold text-center font-Aquawax py-6">
            Alerte bon plan !
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <CardFixHomePage />
          </div>
        </section>

        <section className="w-full h-auto bg-white rounded-md py-6">
          <h2 className="text-black text-2xl font-bold text-center font-Aquawax py-6">
            - Nos marques -
          </h2>
          <Carousel type="marques" />
        </section>

        <section className="w-full h-auto pt-14">
          <div className=" flex flex-row gap-2 items-center justify-center w-full pl-4">
            <h2 className="text-4xl font-bold -translate-y-2 uppercase">
              Archideco
            </h2>
            <Zap size={40} color="#639d87" className="rotate-40" />
            <h2 className="text-4xl font-bold translate-y-2 uppercase">
              Mobalpa
            </h2>
          </div>
          <p className="text-center font-Gotham text-xl py-2 tracking-widest">
            - Une collaboration pétillante -
          </p>
        </section>

        <section className="w-full bg-white rounded-md py-6 font-Aquawax">
          <div className="flex flex-col items-center justify-center gap-2 mb-6 w-full">
            <div className="w-full flex justify-center">
              <h2 className="text-black text-2xl font-bold text-center">
                - Des créations uniques et innovantes -
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 justify-items-center">
            {[
              {
                title: "Salon moderne",
                imgSrc: LivingRoom,
                alt: "Intérieur rêve 1",
              },
              {
                title: "Cuisine élégante",
                imgSrc: Kitchen,
                alt: "Intérieur rêve 2",
              },
              {
                title: "Salle de bain relaxante",
                imgSrc: Bathroom,
                alt: "Intérieur rêve 3",
              },
              {
                title: "Dressing Chic",
                imgSrc: Lounge,
                alt: "Intérieur rêve 1",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative w-full h-72 rounded-md overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:cursor-pointer group"
              >
                <img
                  src={item.imgSrc}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-lg font-semibold font-Gotham">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="w-full h-auto py-4 rounded-md font-Aquawax relative">
          <img
            src="./src/assets/purete.png"
            className="w-full h-auto brightness-25 rounded-md"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center gap-20 items-center text-white">
            <div className=" flex flex-row gap-2 items-center justify-center w-full pl-4">
              <h2 className="text-4xl font-bold -translate-y-2 uppercase">
                Archideco
              </h2>
              <Slash size={40} color="#639d87" className="rotate-40" />
              <h2 className="text-4xl font-bold translate-y-2 uppercase">
                Mobalpa
              </h2>
            </div>
            <p className="text-xl font-semibold font-Gotham text-white">
              RÉALISTE, RÉALISABLE & RÉALISÉ PAR DES ARCHITECTES D'INTÉRIEUR !
            </p>
            <div className="flex flex-row items-center justify-center gap-6">
              <a
                href="https://www.mobalpa.fr/me-rendre-en-magasin"
                target="_blank"
                className="btn btn-primary btn-lg"
              >
                Prendre rendez-vous{" "}
              </a>
              <Link to="/map" className="btn bg-white btn-lg">
                Localisez nos magasins
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
