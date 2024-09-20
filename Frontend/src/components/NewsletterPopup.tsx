import React, { ChangeEvent, useState } from "react";
import { newsletterUser } from "../Requests/UserCrudRequests";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [validate, setValidate] = useState<boolean>(false);

  const registerNewsletter = async (e: any) => {
    e.preventDefault();

    if (!email) {
      return;
    }
    try {
      const response = await newsletterUser(email);

      if (response.status === 200) {
        console.log("ok");
        setValidate(true);
      } else {
        console.log("nikmouk");
      }
    } catch (error) {
      console.log("Erreur lors de l'inscription à la newsletter:", error);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={togglePopup}
        className="bg-green-emerald text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 btn btn-solid-success"
      >
        S'abonner
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              &times;
            </button>
            <h2
              className={`text-xl font-bold text-green-emerald mb-4 ${
                validate ? "text-red-500 font-semiboldj" : ""
              }`}
            >
              {validate ? "Merci ! (Pensez à vérifier vos spams !)" : "Suivez la tendance !"}
            </h2>
            <p
              className={`text-base text-gray-700 mb-6 ${
                validate ? "text-black" : ""
              }`}
            >
              {validate
                ? "Merci d'avoir souscrit à notre newsletter. Promis, nous ne allons pas vous spammer, mais simplement vous envoyer les tendances et les promotions."
                : "Écoutez vos envies et abonnez-vous à notre newsletter pour ne rien manquer des dernières tendances."}
            </p>
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="border border-gray-300 bg-white rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-emerald"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              {validate ? (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-green-emerald text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 btn btn-solid-success"
                >
                  Fermer
                </button>
              ) : (
                <button
                  onClick={(e) => registerNewsletter(e)}
                  className="bg-green-emerald text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 btn btn-solid-success"
                >
                  S'abonner
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsletterPopup;
