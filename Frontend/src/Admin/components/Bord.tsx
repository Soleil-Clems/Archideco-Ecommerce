import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../hooks/AuthContext';
import ShowUser from './ShowUser';
import { getAllMember } from '../../Requests/UserCrudRequests';

export default function Bord() {
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState([])

  useEffect(() => {
    if (authToken) {
      fetchAllUserAdmin();
    }
  }, [authToken]);

  const fetchAllUserAdmin: any = async () => {
    try {
      if (authToken) {
        const data: any = await getAllMember(authToken);


        if (typeof data === 'string') {

          console.log(data);
        } else {


          setUser(data.data)
        }
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-center p-4 text-2xl font-semibold text-teal-500">
        Bienvenue sur notre Dashboard
      </div>
      <div>
        <div>
          <ShowUser user={user} title="Gestion des membres" onUserDeleted={fetchAllUserAdmin}/>
        </div>
      </div>
    </div>
  );
}
