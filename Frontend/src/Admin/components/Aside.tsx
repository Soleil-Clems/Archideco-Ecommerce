import { Boxes, LayoutDashboard, ScanBarcode, Users } from "lucide-react";
import logo from "../../assets/LogoArchideco.png";
import { Link } from "react-router-dom";

interface AsideProps {
    selectedItem: string | null;
    onSelect: (item: string) => void;
}

export default function Aside({ selectedItem, onSelect }: AsideProps) {
    return (
        <aside className="flex flex-col items-center h-screen bg-card text-foreground shadow-lg 
                         w-24 md:w-40 transition-width duration-300">
           
            <Link to="/" className="flex items-start mt-4 md:block hidden">
                <img src={logo} alt="Archideco logo" className="h-20 w-20" />
            </Link>
            <nav className="mt-4">
                <ul className="space-y-2">
                    <li>
                        <div
                            className={`flex items-center p-2 text-muted rounded-lg cursor-pointer transition-colors 
                            ${selectedItem === 'Dashboard' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                            onClick={() => onSelect('Dashboard')}
                        >
                            <LayoutDashboard />
                            <span className="ml-2 hidden md:inline">Dashboard</span>
                        </div>
                    </li>
                    <li>
                        <div
                            className={`flex items-center p-2 text-muted rounded-lg cursor-pointer transition-colors 
                            ${selectedItem === 'Clients' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                            onClick={() => onSelect('Clients')}
                        >
                            <Users />
                            <span className="ml-2 hidden md:inline">Clients</span>
                        </div>
                    </li>
                    <li>
                        <div
                            className={`flex items-center p-2 text-muted rounded-lg cursor-pointer transition-colors 
                            ${selectedItem === 'Commandes' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                            onClick={() => onSelect('Commandes')}
                        >
                            <Boxes />
                            <span className="ml-2 hidden md:inline">Commandes</span>
                        </div>
                    </li>
                   
                    <li>
                        <div
                            className={`flex items-center p-2 text-muted rounded-lg cursor-pointer transition-colors 
                            ${selectedItem === 'Produits' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                            onClick={() => onSelect('Produits')}
                        >
                            <ScanBarcode />
                            <span className="ml-2 hidden md:inline">Produits</span>
                        </div>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
