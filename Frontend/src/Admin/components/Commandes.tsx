import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../hooks/AuthContext";
import { Loader, Truck, CheckCircle, XCircle } from "lucide-react";
import Card from "./Card";
import Chart from "./Chart";
import { deleteUser, getAllUser } from "../../Requests/UserCrudRequests";

const statusOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "Traitement", label: "Traitement" },
  { value: "Livraison", label: "Livraison" },
  { value: "Terminé", label: "Terminé" },
  { value: "Echec", label: "Echec" },
];

const statusIcons: any = {
  Traitement: <Loader className="w-4 h-4 text-slate-500 mr-2" />,
  Livraison: <Truck className="w-4 h-4 text-blue-500 mr-2" />,
  Terminé: <CheckCircle className="w-4 h-4 text-green-500 mr-2" />,
  Echec: <XCircle className="w-4 h-4 text-red-500 mr-2" />,
};

export default function Commandes() {
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [nbClient, setNbClient] = useState(0);
  const [nbCmd, setNbCmd] = useState(0);
  const [nbVente, setNbVente] = useState(0);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    if (authToken) {
      fetchAllUser();
    }
  }, [authToken]);

  const fetchAllUser = async () => {
    try {
      if (authToken) {
        const data: any = await getAllUser(authToken);

        if (typeof data === "string") {
          console.log(data);
        } else {
          const users: any = data.data
            .filter((user: any) => user.commandes.length > 0)
            .flatMap((user: any) =>
              user.commandes.map((commande: any) => ({
                client: `${user.firstname} ${user.lastname}`,
                email: user.email,
                status: commande.status,
                id: user.id,
                commande_id: commande.id,
                products: commande.products,
                date: new Date(commande.order_date.date).toLocaleDateString(
                  "fr-FR"
                ),
              }))
            );

          let donne: any = data.data.filter(
            (user: any) => user.commandes.length > 0
          );
          setNbClient(donne.length);
          setNbCmd(users.length);

          console.log(users);

          const cleanPrice = (priceStr: string) => {
            return parseFloat(
              priceStr.replace(/[^\d.,]/g, "").replace(",", ".")
            );
          };

          const totalPrice = users.reduce((totalUserPrice: any, user: any) => {
            if (Array.isArray(user.products)) {
              const userTotal = user.products.reduce(
                (totalProductPrice: any, product: any) => {
                  const price = cleanPrice(product.price);
                  const reduction = product.reduction || 0;

                  const priceAfterReduction = price - price * (reduction / 100);
                  return totalProductPrice + priceAfterReduction;
                },
                0
              );
              return totalUserPrice + userTotal;
            }
            return totalUserPrice;
          }, 0);

          console.log(
            `Total Price after reduction for all users: ${totalPrice.toFixed(
              2
            )} €`
          );
          setNbVente(totalPrice.toFixed(2));
          setInitialData(users);
        }
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  const filteredData = initialData.filter((item: any) => {
    const matchesNameOrEmail =
      item.client.toLowerCase().includes(searchName.toLowerCase()) ||
      item.email.toLowerCase().includes(searchName.toLowerCase());
    const matchesDate = searchDate ? item.date === searchDate : true;
    const matchesStatus = searchStatus ? item.status === searchStatus : true;

    return matchesNameOrEmail && matchesDate && matchesStatus;
  });

  return (
    <div className="h-full flex-1 p-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          src="https://openui.fly.dev/openui/24x24.svg?text=📈"
          chiffre={`${nbVente} €`}
          text="Ventes de la semaine"
          style="bg-gradient-to-r from-pink-400 to-pink-600"
        />
        <Card
          src="https://openui.fly.dev/openui/24x24.svg?text=📦"
          chiffre={`${nbCmd}`}
          text="Commande de la semaine"
          style="bg-gradient-to-r from-blue-400 to-blue-700"
        />
        <Card
          src="https://openui.fly.dev/openui/24x24.svg?text=📈"
          chiffre={`${nbClient}`}
          text="Total des clients"
          style="bg-gradient-to-r from-green-400 to-green-600"
        />
      </div>
      <div className="p-6 my-4 bg-card text-card-foreground rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Commandes de la semaine</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom ou email"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="p-2 border rounded"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="py-2 px-4 border-b text-left">Client</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Date de commande</th>
              <th className="py-2 px-4 border-b text-left">Id client</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: any) => (
              <tr key={item?.id} className="hover:bg-muted/20">
                <td className="py-2 px-4 border-b">{item.client}</td>
                <td className="py-2 px-4 border-b">{item.email}</td>
                <td className="py-2 px-4 border-b flex items-center">
                  {statusIcons[item.status]}
                  <span
                    className={`py-1 px-2 rounded-full ${
                      item.status === "Traitement"
                        ? "bg-slate-300 text-white"
                        : item.status === "Livraison"
                        ? "bg-blue-400 text-white"
                        : item.status === "Terminé"
                        ? "bg-green-400 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  {new Intl.DateTimeFormat("fr-FR").format(new Date(item.date))}
                </td>
                <td className="py-2 px-4 border-b">{item.id}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <Chart />
        </div>
      </div>
    </div>
  );
}
