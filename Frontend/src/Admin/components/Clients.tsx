import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../hooks/AuthContext';
import { BadgeCheck, BadgeX } from 'lucide-react';
import Profile from './Profile';
import { deleteUser, getAllUser } from '../../Requests/UserCrudRequests';
import ShowUser from './ShowUser';


export default function Clients() {

  const { authToken } = useContext(AuthContext);
  const [initialData, setInitialData] = useState([])

  useEffect(() => {
    if (authToken) {

      fetchAllUser();
    }
  }, [authToken]);

  const fetchAllUser: any = async () => {
    try {
      if (authToken) {
        const data: any = await getAllUser(authToken);


        if (typeof data === 'string') {

          console.log(data);
        } else {

          setInitialData(data.data)
          console.log(data.data)
        }
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  return (
    <div className='h-full flex-1 p-4'>
          <ShowUser user={initialData} title="Liste des clients" onUserDeleted={fetchAllUser} />
    </div>
  );
}
