import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Heading,
  Stack,
  Text,
  Divider,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { getPromotion } from "../Requests/ProductsRequest";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { localhost } from "../constants/Localhost";

interface Product {
  categoriesTitle: string;
  id: number;
  title: string;
  description: string;
  price: string;
  weight: string;
  images: {
    [key: string]: Array<{
      hexa: string;
      color: string;
      image: string;
    }>;
  };
  sizes: {
    hauteur: number;
    largeur: number;
    profondeur: number;
  };
  reduction: number;
  newPrice?: number;
  oldPrice?: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getPromotion();
      if (typeof data === "string") {
        console.error(data);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  
  function removeBaseUrl(url: any) {
    if (localhost == "") {
      if (typeof url == "string") {
        const baseUrl = "http://localhost:8000";
        return url.replace(baseUrl, "");
      }
    } else {
      return url;
    }
  }

  return (
    <>
      {products.map((item: Product) => {
        const imageKey = Object.keys(item.images)[0];
        const imageUrl = item.images[imageKey]?.[0]?.image;
        // console.log(removeBaseUrl(imageUrl))

        // Encode the category title and product title
        const categoryTitleEncoded = encodeURIComponent(item.categoriesTitle);
        const productTitleEncoded = encodeURIComponent(item.title);

        return (
          <Card key={item.id} maxW="sm" className="overflow-hidden">
            <div className="w-40 h-auto py-1 bg-red-500 absolute top-0 left-0 -rotate-45 -translate-x-8 translate-y-4">
              <p className="text-white text-center pr-2">Promotion</p>
            </div>
            <CardBody>
              {imageUrl ? (
                <Image src={removeBaseUrl(imageUrl)} alt={item.title} borderRadius="lg" />
              ) : (
                <p>Pas d'images disponibles</p>
              )}
              <Stack mt="2" spacing="3">
                <Heading size="md">{item.title}</Heading>
                <Text className="line-clamp-2">{item.description}</Text>
                {item.reduction > 0 && (
                  <Text fontSize="xl" className="text-green-duck font-semibold">
                    <span className="text-red-500 text-md">
                      Nouveau prix :{" "}
                    </span>
                    {item.newPrice !== undefined ? `${item.newPrice} €` : ""}
                  </Text>
                )}
                {item.price && (
                  <Text
                    fontSize="lg"
                    className="line-through text-green-duck font-semibold"
                  >
                    {item.price}
                  </Text>
                )}
                <DiscountCalculator
                  price={item.price}
                  reduction={item.reduction}
                  setNewPrice={(newPrice) => {
                    setProducts((prevProducts) =>
                      prevProducts.map((p) =>
                        p.id === item.id ? { ...p, newPrice } : p
                      )
                    );
                  }}
                />
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing="2">
                <Link
                  to={`/product/${categoryTitleEncoded}/${productTitleEncoded}/${encodeURIComponent(
                    item.id
                  )}`}
                  className="bg-blue-500 border p-2 rounded text-white hover:bg-blue-600"
                >
                  Voir le produit
                </Link>
              </ButtonGroup>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
};

export default ProductList;

interface Props {
  price: string; // Prix original sous forme de chaîne
  reduction: number; // Réduction sous forme d'entier
  setNewPrice?: (newPrice: number) => void; // Fonction pour mettre à jour le nouveau prix
}

const DiscountCalculator: React.FC<Props> = ({
  price,
  reduction,
  setNewPrice,
}) => {
  const [pourcentage, setPourcentage] = useState<number>(0);

  useEffect(() => {
    const calculateDiscount = () => {
      try {
        const priceInt = parseFloat(
          price.replace("€", "").replace(",", ".").trim()
        );
        const newPrice = priceInt - reduction;

        if (priceInt <= 0 || reduction < 0 || newPrice <= 0) {
          throw new Error("Les valeurs de prix doivent être positives.");
        }

        const discountPercentage = ((priceInt - newPrice) / priceInt) * 100;

        if (setNewPrice) {
          setNewPrice(newPrice);
        }

        setPourcentage(Math.round(discountPercentage));
      } catch (error) {
        console.error(
          "Erreur lors du calcul du pourcentage de réduction:",
          error
        );
        setPourcentage(0);
      }
    };

    calculateDiscount();
  }, [price, reduction, setNewPrice]);

  return (
    <span className="bg-red-500 text-white text-md font-bold uppercase px-2 rounded mt-2 inline-block col-span-12">
      BON PLAN -{pourcentage.toFixed()}%
    </span>
  );
};
