import React, { useState } from "react";
import { Link } from "react-router-dom";

type AccordionItemProps = {
  title: string;
  link: string;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ title, link }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-300">
      <div className="flex justify-between items-center w-full h-10">
        <Link to={`/${link}`} className="text-lg font-medium">
          {title}
        </Link>
      </div>
    </div>
  );
};

type AccordionProps = {
  items: AccordionItemProps[];
};

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div className="max-w-5xl bg-white shadow-md rounded-lg py-2 pt-6">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} link={item.link} />
      ))}
    </div>
  );
};

const Accordions: React.FC = () => {
  const accordionItems: AccordionItemProps[] = [
    {
      title: "Petit électroménager",
      link: "products/pem",
    },
    {
      title: "Gros électroménager",
      link: "products/gem",
    },
    {
      title: "Aménagement intérieur",
      link: "meubles",
    },
  ];

  return (
    <div className="w-full h-auto">
      <Accordion items={accordionItems} />
    </div>
  );
};

export default Accordions;
