import Navbar from "../components/Navbar";
import { ChevronDown, Filter } from 'lucide-react';
import React, { useState } from 'react';

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                className="flex justify-between items-center w-full py-4 text-left text-lg font-medium text-gray-900 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                <span className="ml-6 flex-shrink-0">
                    {isOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </span>
            </button>
            {isOpen && (
                <div className="pb-4 pr-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const Category = () => {
    return (
        <div className="bg-slate-100 w-screen min-h-dvh h-auto text-black">
            <Navbar />
            <section className="py-12 relative">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full mb-12">
                        <a href="#" className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Nom de la catégorie - Archideco</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Brève description de la catégorie en question</p>
                        </a>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full">
                        <ul className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                            <li className="flex items-center cursor-pointer outline-none group text-[#1E4347]">
                                <span
                                    className="font-normal text-xl leading-8 ml-2 mr-3">Les mixeurs Archideco (X produits)</span>
                            </li>
                        </ul>
                        <div className="relative w-full max-w-sm">
                            <Filter className="absolute top-1/2 -translate-y-1/2 left-4 z-50" />
                            <select id="Offer"
                                className="h-12 border border-gray-300 text-gray-900 pl-12 text-base font-normal leading-7 rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50">
                                <option>Trier par pertinence</option>
                                <option value="option 1">Prix croissant</option>
                                <option value="option 2">Prix décroissant</option>
                                <option value="option 3">Meilleure note</option>
                                <option value="option 4">Nouvauté</option>
                            </select>
                            <ChevronDown className="absolute top-1/2 -translate-y-1/2 right-4 z-50" />
                        </div>
                    </div>
                    <svg className="my-7 w-full" xmlns="http://www.w3.org/2000/svg" width="1216" height="2" viewBox="0 0 1216 2"
                        fill="none">
                        <path d="M0 1H1216" stroke="#E5E7EB" />
                    </svg>
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 md:col-span-3 w-full max-md:max-w-md max-md:mx-auto">
                            <div className="mt-7 box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm overflow-scroll">
                                <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-7">
                                    <p className="font-medium text-base leading-7 text-black ">Tous nos filtres</p>
                                    <p
                                        className="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-[#639D87]">
                                        Réinitialiser</p>
                                </div>
                                <Accordion title="Remise">
                                    <div className="box flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <input id="checkbox-default-1" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-1" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">20% ou plus</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-2" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-2" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">40% ou plus</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">60% ou plus</label>
                                        </div>
                                    </div>
                                </Accordion>
                                <Accordion title="Délais de livraison">
                                    <div className="box flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <input id="checkbox-default-1" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-1" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Retrait en 1h au magasin</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-2" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-2" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Retrait demain au magasin</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Livraison à domicile</label>
                                        </div>
                                    </div>
                                </Accordion>
                                <Accordion title="Marque">
                                    <div className="box flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <input id="checkbox-default-1" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-1" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Vitamix</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-2" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-2" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">KitchenAid</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Philips</label>
                                        </div>
                                    </div>
                                </Accordion>
                                <Accordion title="Prix">
                                    <div className="box flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <input id="checkbox-default-1" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-1" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Moins de 50€</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-2" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-2" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Moins de 100€</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Moins de 200€</label>
                                        </div>
                                    </div>
                                </Accordion>
                                <Accordion title="Avis">
                                    <div className="box flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <input id="checkbox-default-1" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-1" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">1 étoile et plus</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-2" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-2" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">2 étoiles et plus</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">3 étoiles et plus</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">4 étoiles et plus</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                            <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">5 étoiles et plus</label>
                                        </div>
                                    </div>
                                </Accordion>
                                <Accordion title="Caractéristiques">
                                    <Accordion title="Prix">
                                        <div className="box flex flex-col gap-2">
                                            <div className="flex items-center">
                                                <input id="checkbox-default-1" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                                <label htmlFor="checkbox-default-1" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Moins de 50€</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input id="checkbox-default-2" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                                <label htmlFor="checkbox-default-2" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Moins de 100€</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input id="checkbox-default-3" type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:bg-[#639D87]" />
                                                <label htmlFor="checkbox-default-3" className="text-xs font-normal text-gray-600 leading-4 cursor-pointer">Moins de 200€</label>
                                            </div>
                                        </div>
                                    </Accordion>
                                </Accordion>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-9"></div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Category