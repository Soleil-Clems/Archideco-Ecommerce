import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../hooks/AuthContext";
import { getAllProducts } from "../Requests/ProductsRequest";
import { getMyWishlist, updateWishlist } from "../Requests/WishlistRequest";
import { UpdateWishlistBody } from "../Types/wishlist";
import { getMyCart, createCart, updateCart } from "../Requests/CartRequest";
import { useConnected } from "../hooks/Connected";
import { useToast } from "@chakra-ui/react";
import { localhost } from "../constants/Localhost";

interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image?: any;
  images?: any;
  categoryId?: any;
  categoryTitle?: any;
}
interface items {
  id: number;
  name: string;
}

const WishlistPage = () => {
  const { authToken } = useContext(AuthContext);
  const [cart, setCart] = useState<any | null>(null);
  const toast = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlists, setWishlists] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const connected = useConnected();

  const handleGetMyWishlist = async () => {
    try {
      if (authToken) {
        const data: any | string = await getMyWishlist(authToken);
        if (typeof data === "string") {
          setError(data);
          setWishlists(null);
        } else {
          setWishlists(data.data);
        }
      }
    } catch (err) {
      setError("Erreur lors de la récuperation de la liste de souhaits");
      console.error("Erreur:", err);
    }
  };

  const handleAllGetProducts = async () => {
    try {
      if (authToken) {
        const data: any | string = await getAllProducts();

        if (typeof data === "string") {
          setWishlistItems([]);
        } else {
          const idCountMap: { [id: number]: number } = {};
          wishlists?.id_products.forEach((id: any) => {
            let idStr: any = id.toString();
            idCountMap[idStr] = (idCountMap[idStr] || 0) + 1;
          });

          let inWishlists: any = data
            .filter((product: any) => idCountMap[product.id])
            .map((product: any) => ({
              ...product,
              quantity: idCountMap[product.id],
            }));

          setWishlistItems(inWishlists);
        }
      }
    } catch (err) {
      setError("Erreur lors de la récuperation des produit");
      //   console.error("Erreur:", err);
    }
  };

  const handleUpdateWishlist = async (idProduct: number | number[]) => {
    try {
      if (authToken) {
        let newProducts: any;
        if (Array.isArray(idProduct)) {
          newProducts = idProduct;
        } else {
          newProducts = wishlists?.id_products;
          newProducts.push(idProduct);
        }

        const wishlistData: UpdateWishlistBody = {
          idProducts: newProducts,
        };
        const id = wishlists?.id ? wishlists?.id : wishlists.data.id;

        const data: any | string = await updateWishlist(
          authToken,
          id,
          wishlistData
        );
        if (typeof data === "string") {
          setError(data);
        } else {
          setWishlists(data);
        }
        // console.log(data)
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour de la liste de souhaits");
      console.error("Erreur:", err);
    }
  };

  useEffect(() => {
    handleGetMyWishlist();
    handleGetMyCart();
  }, [authToken]);

  useEffect(() => {
    handleAllGetProducts();
  }, [wishlists]);

  useEffect(() => {
    if (wishlistItems.length > 0) {
      const idProduits: number[] = [];

      wishlistItems.forEach((item) => {
        idProduits.push(item.id);
      });
      // console.log(idProduits)

      handleUpdateWishlist(idProduits);
    }
  }, [wishlistItems]);

  const removeFromWishlist = (id: number) => {
    if (wishlistItems.length <= 1) {
      handleUpdateWishlist([]);
      setWishlistItems([]);
      setWishlists([]);

      console.log("remove reussi");
    } else {
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    }
  };

  const handleCreateCart = async (idProduct: number) => {
    try {
      if (authToken) {
        const cartData: any = {
          idProducts: [idProduct],
        };
        const data: any | string = await createCart(authToken, cartData);
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
            title: "Felicitation",
            position: "top",
            description: `Ajouté au panier`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          removeFromWishlist(idProduct);
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
        const updateData: any = {
          idProducts: newProducts,
        };
        let id = cart?.id ? cart?.id : cart.data.id;
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
            description: `Ajouté au panier`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          console.log(cart);
          removeFromWishlist(idProduct);
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
        } else {
          setCart(data.data);
        }
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du panier");
      console.error("Erreur:", err);
    }
  };

  const removeBaseUrl = (url: string) => {
    if (localhost == "") {
      const baseUrl = "http://localhost:8000";
      return url.replace(baseUrl, "");
    } else {
      return url;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {connected ? (
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Ma Wishlist</h1>
          {wishlistItems.length === 0 ? (
            <p className="text-center text-gray-600">
              Votre liste de souhaits est vide.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-sm relative"
                >
                  <Link
                    to={`/${item.categoryTitle}/${item.title}/${item.id}`}
                    className="block"
                  >
                    {Object.keys(item.images).length > 0 && (
                      <img
                        src={removeBaseUrl(
                          item.images[Object.keys(item.images)[0]][0].image
                        )} // Récupérer la première image du premier tableau
                        alt={item.title}
                        className="w-full h-48 object-cover mb-4 rounded"
                      />
                    )}
                    <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                    <p className="text-gray-600 mb-4">{item.price}</p>
                  </Link>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        cart
                          ? handleUpdateCart(item?.id)
                          : handleCreateCart(item?.id)
                      }
                      className="bg-green-emerald text-white px-4 py-2 rounded hover:bg-custom-bg"
                    >
                      Ajouter au panier
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-gray-500 hover:text-red-700"
                      aria-label="Supprimer de la liste de souhaits"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        <main className="flex flex-col container mx-auto min-h-2/3 h-auto px-4 py-8 items-center w-full justify-center">
          <h1 className="text-3xl font-bold mb-6 text-center">
          Vous n'êtes pas connecté
          </h1>
          <Link
            to={"/login"}
            className="text-black font-semibold text-md text-center"
          >
            Profitez de tous nos services en vous connectant rapidement
            <span className="text-blue-500"> ici</span>
          </Link>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default WishlistPage;
