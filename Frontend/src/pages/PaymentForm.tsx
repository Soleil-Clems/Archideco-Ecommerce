import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { AuthContext } from "../hooks/AuthContext";
import { deleteCart, getMyCart } from "../Requests/CartRequest";
import { getAllProducts } from "../Requests/ProductsRequest";
import Logo from "../assets/LogoArchideco.png";
import { Link, useNavigate } from "react-router-dom";
import { localhost } from "../constants/Localhost";
import Footer from "../components/Footer";
import { createOrder } from "../Requests/OrderRequest";
import { getUserInformationForCart } from "../Requests/UserCrudRequests";
import axios from "axios";
import { deleteCodePromo } from "../Requests/ReductionRequest";

const stripePromise = loadStripe(
  "pk_test_51PqAVT06SlE6eckHoKpYCjZX0Yp7teJVJVYO3yvIKMaA9VkdfDrxiungDsUWctkdKw0FVojleTLtToPUQEE8aRgd00wh6UQpAI"
);

const PaymentForm: React.FC = () => {
  const { authToken } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [adresse, setAdresse] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [Promocode, setPromoCode] = useState<string | null>(null);
  const [valuePromoCode, setValuePromoCode] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (authToken) {
      fetchCartItems();
    }

    const getUserinformation = async () => {
      const userInformationComplement = await getUserInformationForCart(
        authToken
      );
      setAdresse(userInformationComplement.adresse);
      setFirstname(userInformationComplement.firstname);
      setName(userInformationComplement.lastname);
      setPhone(userInformationComplement.phone);
      setZipCode(userInformationComplement.postCode);
    };
    getUserinformation();

    const userposition = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.data();

            const city =
              data.address.city || data.address.town || data.address.village;
            setCountry(city);
            console.log(city);
          },
          (error) => {
            console.error("Erreur de géolocalisation:", error);
          }
        );
      } else {
        console.error(
          "La géolocalisation n'est pas supportée par ce navigateur."
        );
      }
    };
    userposition();
    const retrievePromoCodeAndValue = () => {
      const codePromoData = localStorage.getItem("codePromo");

      if (codePromoData) {
        const [codePromo, value] = codePromoData.split("|");

        const intValue = parseInt(value, 10);

        setPromoCode(codePromo);
        if (!isNaN(intValue)) {
          setValuePromoCode(intValue);
        } else {
          console.error("La valeur de réduction n'est pas un entier valide.");
        }
      }
    };
    retrievePromoCodeAndValue();
  }, [authToken]);

  const fetchCartItems = async () => {
    try {
      const cartData = await getMyCart(authToken);
      const productsData = await getAllProducts();

      if (cartData && cartData.data && cartData.data.id_products) {
        const cartProducts = cartData.data.id_products
          .map((id: number) =>
            productsData.find((product: any) => product.id === id)
          )
          .filter(Boolean);

        setCartItems(cartProducts);
        calculateTotal(cartProducts);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du panier:", err);
    }
  };

  const calculateTotal = (items: any[]) => {
    const sum = items.reduce((acc, item) => {
      const price = parseFloat(
        item.price.replace("€", "").replace(",", ".").trim()
      );
      return acc + price;
    }, 0);
    setTotal(sum);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe n'est pas encore chargé.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement === null) {
      setError("Le champ de carte de crédit est manquant.");
      return;
    }

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name },
      });

    if (stripeError) {
      setError(`Erreur de Stripe: ${stripeError.message}`);
      return;
    }

    try {
      if (!authToken) {
        setError("Le token d'authentification est manquant.");
        return;
      }

      const response = await fetch(`${localhost}/api/users/complements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          zip_code: zipCode,
          adresse,
          phone,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(
          `Erreur lors de l'enregistrement des informations de livraison: ${data.error}`
        );
        return;
      }

      const paymentResponse = await fetch(`${localhost}/api/process-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          zip_code: zipCode,
          adresse,
          phone,
          amount: Math.round(total * 100), // Convertir en centimes
        }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.error) {
        setError(`Erreur de paiement: ${paymentData.error}`);
      } else {
        setSuccess("Paiement réussi");
        setError(null);
      }
    } catch (err) {
      setError("Erreur lors du traitement des informations");
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

  async function handlesuccess(e: any): Promise<void> {
    // Marquer la fonction comme `async`
    try {
      // Appeler l'API pour créer la commande et attendre la réponse
      if (authToken) {
        const prodIds = cartItems.map((produit: any) => produit.id);
        console.log(prodIds);

        const field = {
          productIds: prodIds,
        };
        const data = await createOrder(authToken, field);
      }

      const deleteCarte = await deleteCart(authToken);
      const deletePromo = await deleteCodePromo(authToken, Promocode);
      localStorage.removeItem("codePromo");
      // Après avoir reçu la réponse et effectué toutes les opérations nécessaires, naviguer
      setTimeout(() => {
        navigate("/thankyou");
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
    }
  }

  return (
    <div className="grid md:grid-cols-2 h-screenbg-white ">
      <div className="p-4 bg-gray-100 flex flex-col">
        <div className="max-w-md mx-auto w-full">
          <div className="flex gap-4 items-center">
            <h2 className="text-2xl font-semibold">Votre panier</h2>
            <Link to="/">
              <img src={Logo} alt="Logo" height={100} width={100} />
            </Link>
          </div>

          {Promocode && valuePromoCode !== null ? (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-semibold mb-2 text-green-emerald">
                Code Promo
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Code :</span>
                <span className="text-gray-900 font-bold">{Promocode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Réduction :</span>
                <span className="text-green-600 font-bold">
                  {valuePromoCode} €
                </span>
              </div>
            </div>
          ) : null}

          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mt-4">
            <span className="font-bold">Délai de livraison estimé: </span>
            <span>
              {(() => {
                // Calculate the date 30 days from now
                const today = new Date();
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + 30);

                // Format the future date in French format (e.g., 1er septembre 2024)
                const options: Intl.DateTimeFormatOptions = {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                };
                const formattedDate = new Intl.DateTimeFormat(
                  "fr-FR",
                  options
                ).format(futureDate);

                if (cartItems.length === 0) {
                  return "No items in cart";
                }

                // Find the item with the maximum delivery delay
                const itemWithMaxDelay = cartItems.reduce((max, item) => {
                  const maxDays =
                    parseInt(max.delivery_delai.split(" ")[0], 10) || 0;
                  const itemDays =
                    parseInt(item.delivery_delai.split(" ")[0], 10) || 0;
                  return itemDays > maxDays ? item : max;
                }, cartItems[0]);

                // Return the item name with the maximum delay and future date
                return ` ${parseInt(
                  itemWithMaxDelay.delivery_delai.split(" ")[0],
                  10
                )} jours (Date de livraison estimée : ${formattedDate})`;
              })()}
            </span>
          </div>
          <div className="mt-4 font-bold flex justify-between">
            <span>Total : </span>
            <span>
              {cartItems
                .reduce((acc, item) => {
                  const priceInt = parseFloat(
                    item.price.replace("€", "").replace(",", ".")
                  );
                  const reducedPrice =
                    item.reduction > 0 ? priceInt - item.reduction : priceInt;
                  return acc + reducedPrice;
                }, 0)
                .toFixed(2) - valuePromoCode}{" "}
              €
            </span>
          </div>
          <div className="mt-4 font-bold flex justify-between">
            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 bg-gray-100 shadow-lg rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                Récapitulatif de votre commande
              </h2>
              {cartItems.map((item, index) => {
                // Calculer le prix en nombre en supprimant le symbole '€' et en remplaçant la virgule par un point si nécessaire
                const priceInt = parseFloat(
                  item.price.replace("€", "").replace(",", ".")
                );
                const reducedPrice = priceInt - item.reduction; // Calculer le prix après réduction

                return (
                  <div
                    key={index}
                    className="flex items-center w-full mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={removeBaseUrl(
                          item.images[Object.keys(item.images)[0]][0].image
                        )}
                        alt={item.title}
                        className="h-40 w-40 object-cover rounded-lg"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Prix : {priceInt.toFixed(2)}€
                      </p>

                      {item.reduction > 0 && (
                        <>
                          <p className="text-gray-600 mt-1">
                            Réduction : -{item.reduction}€
                          </p>
                          <p className="text-red-600 mt-1 font-bold">
                            Prix après réduction : {reducedPrice.toFixed(2)}€
                          </p>
                        </>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        {/* Add any additional information or actions here */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex justify-center mt-8">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}

          <h2 className="text-2xl font-bold">Coordonnées de livraison</h2>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option selected>Choissisez un pays</option>
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="SW">Suisse</option>
            <option value="LX">Luxembourg</option>
          </select>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              placeholder="Nom"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              placeholder="Prénom"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              placeholder="Adresse"
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              placeholder="Code Postal"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              placeholder="Ville"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              placeholder="Téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex">
            <div className="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                value=""
                className="w-4 h-4 border-gray-300 rounded"
              />
            </div>
            <div className="ms-2 text-sm">
              <label
                htmlFor="helper-checkbox"
                className="font-medium text-gray-900 dark:text-gray-300"
              >
                Sauvegarder mes coordonnées pour la prochaine fois
              </label>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Détails de la carte</h2>
          <div>
            <CardElement className="border p-4 rounded-md shadow-sm" />
          </div>
          <div>
            <input
              placeholder="Nom sur la carte"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex">
            <div className="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                value=""
                className="w-4 h-4 border-gray-300 rounded"
              />
            </div>
            <div className="ms-2 text-sm">
              <label
                htmlFor="helper-checkbox"
                className="font-semibold text-black  dark:text-gray-300"
              >
                Utiliser l'adresse d'expédition comme adresse de facturation
              </label>
            </div>
          </div>
          <button
            type="submit"
            onClick={(e: any) => handlesuccess(e)}
            className="w-full mt-4 border border-gray-300 text-white font-bold px-6 py-2 rounded bg-[#639d87]"
          >
            Payer{" "}
            {cartItems
              .reduce((acc, item) => {
                const priceInt = parseFloat(
                  item.price.replace("€", "").replace(",", ".")
                );
                const reducedPrice =
                  item.reduction > 0 ? priceInt - item.reduction : priceInt;
                return acc + reducedPrice;
              }, 0)
              .toFixed(2) - valuePromoCode}{" "}
            €
          </button>
        </form>
      </div>
    </div>
  );
};

const Payment: React.FC = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
    <Footer />
  </Elements>
);
export default Payment;
