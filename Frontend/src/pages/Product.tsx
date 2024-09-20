import { useState, useEffect, useContext, Key } from "react";
import { AuthContext } from "../hooks/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Accordion from "../components/Accordion";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { getMyCart, createCart, updateCart } from "../Requests/CartRequest";
import {
  getCategories,
  getProductByCategoryId,
} from "../Requests/ProductsRequest";
import { localhost } from "../constants/Localhost";
import { CreateCartBody } from "../Types/cartCrud";
import {
  Heart,
  ShoppingBasket,
  HeartCrack,
  ShoppingCart,
} from "lucide-react";
import {
  getMyWishlist,
  createWishlist,
  updateWishlist,
} from "../Requests/WishlistRequest";
import { CreateWishlistBody, UpdateWishlistBody } from "../Types/wishlist";
import { useConnected } from "../hooks/Connected";
import { getWishListItems } from "../hooks/wishListe";

export default function Product() {
  const { category, productTitle, id } = useParams();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [cart, setCart] = useState<any | null>(null);
  const [wishlists, setWishlists] = useState<any | null>(null);
  const connected = useConnected();
  const [otherProduct, setOtherProduct] = useState<any | null>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        // setCategories(categoriesData);

        const titleSearched = category?.toLowerCase();
        const data = categoriesData
          .filter((c) => c.title.toLowerCase() === titleSearched)
          .map((c) => c.id);

        if (data.length > 0) {
          setCategoryId(data[0]);
        } else {
          setCategoryId(null);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, [category]);

  useEffect(() => {
    if (authToken && !wishlists) {
      handleGetMyWishlist();
    }
  }, [authToken]);

  useEffect(() => {
    if (product) {
      setMainImage(
        removeBaseUrl(product?.images[Object.keys(product?.images)[0]][0].image)
      );
    }
  }, [product]);

  useEffect(() => {
    if (categoryId !== null) {
      handleGetProduct(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    handleGetMyCart();
  }, [cart]);

  const handleGetProduct = async (categoryId: number) => {
    try {
      const data: any[] = await getProductByCategoryId(categoryId);
      const productId = id;
      const expectedTitle: any = productTitle;

      const specificProduct = data.find(
        (product: any) =>
          product.id == productId &&
          product.title.toLowerCase() == expectedTitle.toLowerCase()
      );

      if (specificProduct) {
        setProduct(specificProduct);
      } else {
        navigate("/sorry/not-found");
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleCreateCart = async (idProduct: number) => {
    try {
      if (authToken) {
        const cartData: CreateCartBody = {
          idProducts: [idProduct],
        };
        const data: any | string = await createCart(authToken, cartData);
        if (typeof data === "string") {
          setError(data);

          toast({
            title: data,
            description: "",
            status: "error",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
        } else {
          setCart(data);
          toast({
            title: "Felicitation",
            position: "top",
            description: `${product?.title} ajouté au panier`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
      }
    } catch (err) {
      setError("Erreur lors de la création du panier");
      console.error("Erreur:", err);
    }
  };

  const handleUpdateCart = async (idProduct: number) => {
    try {
      if (authToken) {
        let newProducts = cart?.id_products;
        newProducts.push(idProduct);
        const updateData: CreateCartBody = {
          idProducts: newProducts,
        };
        let id = cart?.id;
        const data: any | string = await updateCart(authToken, id, updateData);
        if (typeof data === "string") {
          setError(data);
          console.log("error", data);
          toast({
            title: data,
            description: "",
            status: "error",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
        } else {
          setCart(data);
          toast({
            title: "Félicitations",
            position: "top",
            description: `${product?.title} ajouté au panier`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          console.log(cart);
        }
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du panier");
      console.error("Erreur:", err);
    }
  };

  const handleGetMyCart = async () => {
    try {
      if (authToken) {
        const data: any | string = await getMyCart(authToken);
        if (typeof data === "string") {
          setCart(null);
          setError(data);
        } else {
          setCart(data.data);
        }
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du panier");
      console.error("Erreur:", err);
    }
  };

  const changeImage = (src: string) => {
    setMainImage(src);
  };

  const handleCreateWishlist = async (idProduct: number) => {
    try {
      if (authToken) {
        const wishlistData: CreateWishlistBody = {
          idProducts: [idProduct],
        };
        const data: any | string = await createWishlist(
          authToken,
          wishlistData
        );
        if (typeof data === "string") {
          setError(data);
        } else {
          setWishlists(data.data);
          toast({
            title: "Félicitations",
            position: "top",
            description: `${product?.title} ajouté au panier`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
        console.log(data.data);
      }
    } catch (err) {
      setError("Erreur lors de la création de la liste de souhaits");
      console.error("Erreur:", err);
    }
  };

  const handleUpdateWishlist = async (idProduct: number) => {
    try {
      if (authToken) {
        let newProducts = wishlists?.id_products
          ? [...wishlists.id_products]
          : []; // Ensuring newProducts is always an array
        let add: boolean = true;

        if (newProducts.includes(idProduct)) {
          newProducts = newProducts.filter(
            (item: number) => item !== idProduct
          ); // Assuming id_products is an array of numbers
          add = false;
        } else {
          newProducts.push(idProduct);
        }

        const wishlistData: UpdateWishlistBody = {
          idProducts: newProducts,
        };

        const id = wishlists?.id;
        console.log(idProduct, wishlists?.id_products); // Use optional chaining to avoid potential errors if wishlists is undefined

        const data: any | string = await updateWishlist(
          authToken,
          id,
          wishlistData
        );

        if (typeof data === "string") {
          setError(data);
        } else {
          setWishlists(data.data);

          toast({
            title: "Félicitations",
            position: "top",
            description: `${product?.title} ${
              add ? "ajouté à" : "retiré de"
            } la wishlist`,
            status: add ? "success" : "warning",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error); // Improved logging message
    }
  };

  const handleGetMyWishlist = async () => {
    try {
      if (authToken) {
        const data: any | string = await getMyWishlist(authToken);
        if (typeof data === "string") {
          setError(data);
          setWishlists(null);
        } else {
          setWishlists(data.data);
          // console.log("wishlist", data.data)
        }
      }
    } catch (err) {
      setError("Erreur lors de la récuperation de la liste de souhaits");
      console.error("Erreur:", err);
    }
  };

  const handleAddToWishlist = (idProduct: number) => {
    if (!wishlists) {
      handleCreateWishlist(idProduct);
    } else {
      handleUpdateWishlist(idProduct);
    }
  };

  const handleAddToCart = (idProduct: number) => {
    if (!cart) {
      handleCreateCart(idProduct);
    } else {
      handleUpdateCart(idProduct);
    }
  };

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
    <div className="bg-white w-screen min-h-screen text-black">
      <Navbar />
      <main className="flex  mt-6 px-4 gap-6">
        <div className="flex flex-col items-center md:items-start md:flex-row  w-full justify-center gap-6">
          <div className="flex flex-col-reverse md:flex-row gap-2 items-start ">
            <div className="flex flex-row flex-wrap md:flex-col items-center gap-2 md:gap-0  w-full md:w-1/4 space-y-4 md:space-y-2">
              {product?.images &&
                Object.values(product.images)
                  .flat()
                  .slice(0, 12)
                  .map((imageObj: any, index) => (
                    <div
                      key={index}
                      className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex items-center justify-center flex-shrink-0"
                    >
                      <img
                        key={index}
                        src={removeBaseUrl(imageObj.image)}
                        alt={`Thumbnail ${index + 1}`}
                        className="cursor-pointer rounded-lg w-full h-full object-cover  border border-gray-300 hover:border-blue-500"
                        onClick={() =>
                          changeImage(removeBaseUrl(imageObj.image))
                        }
                      />
                    </div>
                  ))}
            </div>

            <div className="flex-1 w-full h-full md:w-2/4 mb-4 md:mb-0">
              <img
                src={
                  mainImage
                    ? mainImage
                    : removeBaseUrl(
                        product?.images[Object.keys(product?.images)[0]][0]
                          .image
                      )
                }
                alt="Main product image"
                className="rounded-lg w-full rounded-xl w-[300px] md:w-[500px] h-full"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="flex justify-center flex-col space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {product?.title}
            </h2>
            <p className="text-lg text-gray-700 mb-2">{product?.description}</p>
            <p className="flex gap-4 text-lg text-red-500 font-bold mb-4">
              {product?.reduction > 0 ? (
                <>
                  <span className="line-through text-zinc-700 text-xl col-span-6 decoration-red-500">
                    {parseFloat(
                      product?.price.replace("€", "").replace(",", ".")
                    )}
                    €
                  </span>
                  <span>
                    {(
                      parseFloat(
                        product?.price.replace("€", "").replace(",", ".")
                      ) - product?.reduction
                    ).toFixed(2)}
                    €
                  </span>
                </>
              ) : (
                <span>{product?.price}</span>
              )}
            </p>
            <div className="flex flex-wrap items-center space-x-2 mb-4">
              <span className="bg-green-500 text-white px-2 py-1 rounded">
                G
              </span>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded">
                A
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded">T</span>
            </div>

            <p className="text-gray-600 mb-2">
              <span className="font-bold">Delai de livraison :</span>{" "}
              {product?.delivery_delai}
            </p>
            <Accordion title="Carateristiques">
              <ul className="list-disc pl-5">
                <li>
                  <span className="font-bold">Poids</span>: {product?.weight}
                </li>
                {product && product.sizes ? (
                  Object.entries(product.sizes).map(([key, value], index) => (
                    <li key={index}>
                      <span className="font-bold">{key}</span>: {value as any}
                    </li>
                  ))
                ) : (
                  <p></p>
                )}
              </ul>
            </Accordion>
            <div className="flex items-center space-x-2">
              {connected ? (
                // Si l'utilisateur est connecté
                <div className="w-full flex flex-row gap-2 ">
                  {/* Bouton pour ajouter le produit au panier */}
                  <button
                    className="flex gap-2 items-center bg-green-emerald text-white hover:bg-green-duck rounded px-4 py-2"
                    onClick={() => handleAddToCart(product?.id)}
                  >
                    <ShoppingBasket className="text-white" />
                    Ajouter au panier
                  </button>

                  {/* Condition pour afficher le bouton "Retirer de vos envies" ou "Ajouter aux envies" */}
                  {wishlists?.id_products.includes(product?.id) ? (
                    <button
                      className="flex gap-2 items-center bg-slate-400 hover:bg-slate-500 text-white rounded px-4 py-2"
                      onClick={() => handleAddToWishlist(product?.id)}
                    >
                      <HeartCrack />
                      Retirer de vos envies
                    </button>
                  ) : (
                    <button
                      className="flex gap-2 items-center border-2 border-green-emerald hover:bg-slate-100 hover:border-green-duck bg-white text-black rounded px-4 py-2"
                      onClick={() => handleAddToWishlist(product?.id)}
                    >
                      <Heart color="red" />
                      Ajouter aux envies
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full flex flex-row gap-2">
                  <Link
                    to="/login"
                    className="flex gap-2 items-center bg-green-emerald text-white hover:bg-green-duck rounded px-4 py-2"
                  >
                    <ShoppingCart color="black" />
                    Commandez en quelques click !
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
