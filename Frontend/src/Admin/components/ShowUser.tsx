import { useEffect, useState, useContext } from 'react';
import { BadgeCheck, BadgeX, DatabaseIcon } from 'lucide-react';
import Profile from './Profile';
import { deleteUser, updateUser } from '../../Requests/UserCrudRequests';
import { AuthContext } from '../../hooks/AuthContext';

type Client = {
    client: string;
    email: string;
    status: string;
    activity: boolean;
    complements: any;
    date: string;
    roles: string;
    id: number;
    code_promo?:any;
    commande:any;
};

const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Verified', label: 'Vérifié' },
    { value: 'Unverified', label: 'Non vérifié' },
];

const roleOptions = [
    { value: '', label: 'Tous les rôles' },
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'Utilisateur' },
];

const activityOptions = [
    { value: '', label: 'Toutes les activités' },
    { value: 'true', label: 'Actif' },
    { value: 'false', label: 'Inactif' },
];

const statusIcons: any = {
    Verified: <BadgeCheck className="w-4 h-4 text-green-500 mr-2" />,
    Unverified: <BadgeX className="w-4 h-4 text-red-500 mr-2" />,
};

export default function ShowUser({ user, title, onUserDeleted }: { user: any, title: string, onUserDeleted: () => void }) {

    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [searchActivity, setSearchActivity] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 5;
    const { authToken } = useContext(AuthContext);
    const [initialData, setInitialData] = useState<Client[]>([]);

    useEffect(() => {
        if (authToken) {
            fetchAllUser();
        }
    }, [authToken, user]);

    const fetchAllUser = async () => {
        try {
            if (authToken) {
                const users: Client[] = user.map((user: any) => ({
                    client: `${user.firstname} ${user.lastname}`,
                    email: user.email,
                    activity: user.is_actif,
                    id: user.id,
                    commandes:user.commandes,
                    date: user.updated_at.date,
                    complements: user.user_complements,
                    code_promo: user.code_promo,
                    status: user.verified ? 'Verified' : 'Unverified',
                    roles: user.roles.includes('ROLE_ADMIN') ? 'Admin' : 'Utilisateur',
                }));
                setInitialData(users);
            }
        } catch (error) {
            console.log('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            if (authToken) {
                const data: any = await deleteUser(authToken, id);
                if (typeof data === 'string') {
                    console.log(data);
                } else {
                    
                    onUserDeleted();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeRole = async (id:number ,role:string)=>{
        try {

            if (authToken) {
                const fields={
                    "roles":role
                }
                const data: any = await updateUser(authToken, id, fields)

                if(typeof data == "string"){
                    console.log(DatabaseIcon)
                }else{
                    onUserDeleted();
                }
                
            }
        } catch (error) {
            console.log(error)
        }
    }

    const filteredData = initialData.filter((item) => {
        const matchesNameOrEmail =
            item.client.toLowerCase().includes(searchName.toLowerCase()) ||
            item.email.toLowerCase().includes(searchName.toLowerCase());
        const matchesDate = searchDate ? item.date === searchDate : true;
        const matchesStatus = searchStatus ? item.status === searchStatus : true;
        const matchesRole = searchRole ? item.roles === searchRole : true;
        const matchesActivity = searchActivity ? item.activity.toString() === searchActivity : true;

        return matchesNameOrEmail && matchesDate && matchesStatus && matchesRole && matchesActivity;
    });

    const totalPages = Math.ceil(filteredData.length / clientsPerPage);

    const currentClients = filteredData.slice(
        (currentPage - 1) * clientsPerPage,
        currentPage * clientsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="h-full flex-1 p-4">
            {!selectedClient ? (
                <div className="p-6 my-4 bg-card text-card-foreground rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    <div className="mb-4 flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="p-2 border rounded w-full sm:w-auto"
                        />
                        <input
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            className="p-2 border rounded w-full sm:w-auto"
                        />
                        <select
                            value={searchStatus}
                            onChange={(e) => setSearchStatus(e.target.value)}
                            className="p-2 border rounded w-full sm:w-auto"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={searchRole}
                            onChange={(e) => setSearchRole(e.target.value)}
                            className="p-2 border rounded w-full sm:w-auto"
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={searchActivity}
                            onChange={(e) => setSearchActivity(e.target.value)}
                            className="p-2 border rounded w-full sm:w-auto"
                        >
                            {activityOptions.map((option) => (
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
                                <th className="py-2 px-4 border-b text-left">Activité</th>
                                <th className="py-2 px-4 border-b text-left">Rôle</th>
                                <th className="py-2 px-4 border-b text-left">Mise à jour</th>
                                <th className="py-2 px-4 border-b text-left">Id client</th>
                                <th className="py-2 px-4 border-b text-left">Changer de rôle</th>
                                <th className="py-2 px-4 border-b text-left">Désactiver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentClients.map((item: Client) => (
                                <tr key={item.id} className="hover:bg-muted/20">
                                    <td
                                        className="py-2 px-4 border-b  cursor-pointer"
                                        onClick={() => setSelectedClient(item)}
                                    >
                                     
                                        {item.client}
                                    </td>
                                    <td className="py-2 px-4 border-b">{item.email}</td>
                                    <td className="py-2 px-4 border-b flex items-center">
                                        {statusIcons[item.status]}
                                        {item.status}
                                    </td>
                                    <td className="py-2 px-4 border-b">{item.activity ? 'Actif' : 'Inactif'}</td>
                                    <td className="py-2 px-4 border-b">{item.roles}</td>
                                    <td className="py-2 px-4 border-b">
                                        {new Intl.DateTimeFormat('fr-FR').format(new Date(item.date))}
                                    </td>
                                    <td className="py-2 px-4 border-b">{item.id}</td>
                                    <td className="py-2 px-4 border-b text-white">
                                        {item.roles === 'Admin' ? (
                                            <button
                                                onClick={() => handleChangeRole(item.id, "user")}
                                                className="flex items-center justify-center bg-teal-500 px-2 rounded-full"
                                            >
                                                To user
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleChangeRole(item.id, "admin")}
                                                className="flex items-center justify-center bg-green-500 px-2 rounded-full"
                                            >
                                                To admin
                                            </button>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b text-white">
                                        {item.activity ? (
                                            <button
                                                className="flex items-center justify-center bg-red-500 px-2 rounded-full"
                                                onClick={() => handleDeleteUser(item.id)}
                                            >
                                                Désactiver
                                            </button>
                                        ) : (
                                            ''
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center gap-2 rounded-md justify-center mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-1 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'
                                }`}
                        >
                            Précédent
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'
                                }`}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            ) : (
                <Profile client={selectedClient} onBack={() => setSelectedClient(null)} onLoad={onUserDeleted}/>
            )}
        </div>
    );
}
