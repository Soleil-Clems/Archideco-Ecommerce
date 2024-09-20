import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../hooks/AuthContext";
import { getWishlist } from "../../Requests/WishlistRequest";
import { getAllProducts } from "../../Requests/ProductsRequest";
import { getCart } from "../../Requests/CartRequest";
import { Link } from "react-router-dom";
import { createPromo } from "../../Requests/ReductionRequest";
import { X } from "lucide-react";
interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image?: any;
  images?: any;
  categoryId?: any;
  categoryTitle?: any;
}

interface CartItem {
  id: number;
  title: string;
  price: string;
  quantity: number;
  image?: any;
  images?: any;
  categoryId?: any;
  categoryTitle?: any;
}

export default function Profile({
  client,
  onBack,
  onLoad,
}: {
  client: any;
  onBack: any;
  onLoad: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Info");
  const { authToken } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlists, setWishlists] = useState<any | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<any | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [promoCodes, setPromoCodes] = useState(client.code_promo);

  const handleRemovePromo = (id: number) => {
    const updatedPromoCodes = promoCodes.filter(
      (promo: any) => promo.id !== id
    );
    setPromoCodes(updatedPromoCodes);
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  useEffect(() => {
    const handleAllGetProducts = async () => {
      try {
        if (authToken) {
          const data: any | string = await getAllProducts();

          if (typeof data === "string") {
            setWishlistItems([]);
          } else {
            setProducts(data);
          }
        }
      } catch (err) {
        setError("Erreur lors de la récupération des produits");
      }
    };
    handleAllGetProducts();
  }, []);

  useEffect(() => {
    if (wishlists) {
      const filteredProducts = products.filter((product: any) =>
        wishlists.id_products.includes(product.id)
      );
      setWishlistItems(filteredProducts);
    }
  }, [wishlists]);

  useEffect(() => {
    if (cart) {
      const filteredProducts = products.filter((product: any) =>
        cart.id_products.includes(product.id)
      );
      setCartItems(filteredProducts);
    }
  }, [cart]);

  const fetchWishlist = async () => {
    try {
      if (authToken) {
        const data: any = await getWishlist(authToken, client.id);
        if (typeof data === "string") {
          console.log(data);
        } else {
          setWishlists(data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCart = async () => {
    try {
      if (authToken) {
        const data: any = await getCart(authToken, client.id);
        if (typeof data === "string") {
          console.log(data);
        } else {
          setCart(data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!client) {
    return <div>No client selected.</div>;
  }

  const handleCreateCodePromo = async () => {
    if (!code || !value || !expireAt) {
      alert("Tous les champs sont requis.");
      return;
    }

    const datapromo: any = {
      code,
      value,
      expire_at: expireAt,
      user_id: client.id,
    };

    try {
      if (authToken) {
        const data: any = await createPromo(authToken, datapromo);

        if (typeof data === "string") {
          console.log(data);
          alert("Erreur lors de la création du code promo : " + data);
        } else {
          onLoad();
          alert("Code promo créé avec succès.");
          setCode("");
          setValue("");
          setExpireAt("");
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la création du code promo.");
    }
  };

  const infoClient = () => {
    return (
      <div className="w-full flex justify-center">
        <div className=" w-1/2 justify-center grid grid-cols-1 gap-8 p-6 bg-gray-50 rounded-xl shadow-md">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold  text-teal-500">Id:</span>{" "}
              {client.id}
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-teal-500">Utilisateur:</span>{" "}
              {client.client}
            </p>

            <p className="text-gray-700 text-lg">
              <span className="font-semibold  text-teal-500">Email:</span>{" "}
              {client.email}
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-semibold  text-teal-500">Roles:</span>{" "}
              {client.roles}
            </p>

            <p className="text-gray-700 text-lg">
              <span className="font-semibold  text-teal-500">Status:</span>{" "}
              {client.status}
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-teal-500">
                Date d'inscription:
              </span>{" "}
              {client.date.split(" ")[0]}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const infoWishlist = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {wishlistItems.map((produit) => (
          <Link
            key={produit.id}
            to={`/product/${produit.categoryTitle}/${produit.title}/${produit.id}`}
            className="block bg-white p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            <h3 className="text-lg font-semibold mb-2">{produit.title}</h3>
            <p className="text-gray-700">{produit.price}</p>
          </Link>
        ))}
      </div>
    );
  };

  const infoCart = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {cartItems.map((produit) => (
          <Link
            key={produit.id}
            to={`/product/${produit.categoryTitle}/${produit.title}/${produit.id}`}
            className="block bg-white p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            <h3 className="text-lg font-semibold mb-2">{produit.title}</h3>
            <p className="text-gray-700">{produit.price}</p>
          </Link>
        ))}
      </div>
    );
  };

  const infoCommande = () => {
    console.log(client.commandes);
    return (
      <div>
        {client.commandes.map((order: any, index: number) => (
          <div key={index} className="border border-slate-300 m-2 p-2">
            <p>
              <strong>Commande ID:</strong> {order.id}
            </p>
            <p>
              <strong>Statut:</strong> {order.status}
            </p>
            <p>
              <strong>Date:</strong> {order.order_date.date}
            </p>
            <div>
              {order.products.map((product: any) => (
                <div>
                  <p>
                    {product.title} - {product.price}
                  </p>
                  <p>reduction - {product.reduction}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const infoCodePromo = () => {
    console.log(client.code_promo);

    return (
      <div className="flex flex-col">
        <h2 className="font-semibold flex justify-center text-lg text-teal-500 p-4">
          Gérer les codes promo
        </h2>
        <div className="flex flex-col">
          <p className="flex gap-2 justify-center">
            Créer un code promo pour cet utilisateur
          </p>
          <div className="flex flex-col gap-3 justify-center w-full">
            <div className="w-full">
              <p>Code promo : </p>
              <input
                type="text"
                placeholder="Entrer le code"
                className="outline-none border rounded-md p-2 w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="w-full">
              <p>Pourcentage de réduction</p>
              <input
                type="number"
                placeholder="Entrer la valeur"
                className="outline-none border rounded-md p-2 w-full"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="w-full">
              <p>Date de fin de la promotion</p>
              <input
                type="datetime-local"
                placeholder="Date d'expiration"
                className="outline-none border rounded-md p-2 w-full"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
              />
            </div>
            <button
              className="flex rounded-md bg-teal-500 text-white px-4 py-2 hover:bg-teal-600 transition duration-300"
              onClick={handleCreateCodePromo}
            >
              Créer
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="font-semibold flex justify-center text-lg text-teal-500 p-4">
            Code promo de {client.client}
          </h2>
          <div className="flex w-full gap-2">
            {promoCodes.map((promo: any) => (
              <div
                key={promo.id}
                className="relative flex flex-col  bg-white p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
              >
                <div className="flex justify-end my-2">
                  <div className="bg-red-500 w-3 flex justify-center rounded-sm text-white h-3">
                    <X
                      className="text-sm h-3 "
                      onClick={() => handleRemovePromo(promo.id)}
                    />
                  </div>
                </div>
                <p className="flex gap-2  font-semibold mb-2">
                  <span className="flex text-teal-500 font-semibold">
                    Code:{" "}
                  </span>{" "}
                  {promo.code}{" "}
                </p>
                <p className="flex gap-2 font-semibold mb-2">
                  <span className="flex text-teal-500 font-semibold">
                    Réduction:{" "}
                  </span>{" "}
                  {promo.value} €
                </p>
                <p className="flex gap-4 text-gray-700 text-sx">
                  <span className="flex gap-1 text-teal-500 font-semibold">
                    Du:
                  </span>
                  {new Date(promo.created_at.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <span className="flex gap-1 text-teal-500 font-semibold">
                    Au:
                  </span>
                  {new Date(promo.expire_at.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Info":
        return client ? (
          infoClient()
        ) : (
          <div className="text-gray-500">Aucun utilisateur sélectionné</div>
        );
      case "Envies":
        return wishlists ? (
          infoWishlist()
        ) : (
          <div className="text-gray-500">Liste des envies du client</div>
        );
      case "Panier":
        return cart ? (
          infoCart()
        ) : (
          <div className="text-gray-500">Contenu du panier du client</div>
        );
      case "Commandes":
        return client.commandes ? (
          infoCommande()
        ) : (
          <div className="text-gray-500">
            Historique des commandes du client
          </div>
        );
      case "Facture":
        return <div className="text-gray-500">Factures du client</div>;
      case "Code Promo":
        return infoCodePromo();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          {client.client}
        </h2>
        <p className="text-gray-600 text-center mt-2">{client.email}</p>
        <hr className="w-full border-t border-gray-300 my-4" />
        <div className="flex justify-center space-x-6 mb-6">
          {[
            "Info",
            "Envies",
            "Panier",
            "Commandes",
            // "Facture",
            "Code Promo",
          ].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer text-lg ${
                activeTab === tab ? "text-primary" : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="w-full">{renderContent()}</div>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition duration-300"
        >
          Retour
        </button>
      </div>
    </div>
  );
}
