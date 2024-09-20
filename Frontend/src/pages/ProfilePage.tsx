// UserProfile.tsx
import React from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
}

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
}

interface UserProfileProps {
  user: User;
  orders: Order[];
}

const UserProfile: React.FC<UserProfileProps> = ({ user, orders }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      {/* User Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Informations Utilisateur
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Nom:</span> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p>
            <span className="font-medium">Adresse e-mail:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Adresse:</span> {user.address}
          </p>
          <p>
            <span className="font-medium">Numéro de téléphone:</span>{" "}
            {user.phone}
          </p>
        </div>
      </div>

      {/* Order List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Commandes Passées</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Total</th>
                <th className="py-2 px-4 border-b text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border-b">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.date}</td>
                  <td className="py-2 px-4 border-b">{order.total} €</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
