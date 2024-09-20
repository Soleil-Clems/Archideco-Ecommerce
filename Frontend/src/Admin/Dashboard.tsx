import React, { useState } from 'react';
import Aside from './components/Aside';
import Bord from './components/Bord';
import Clients from './components/Clients';
import Commandes from './components/Commandes';
import Produits from './components/Produits';


export default function Dashboard() {
    const [selectedItem, setSelectedItem] = useState<string | null>("Dashboard");

    return (
        <div className="bg-slate-100 w-screen h-screen text-black overflow-none scrollbar-none">
            <main className="h-auto min-w-screen flex gap-2">
                <div>
                    <Aside selectedItem={selectedItem} onSelect={setSelectedItem} />
                </div>
                <div className='flex-1 w-full h-screen bg-white m-2 rounded-sm overflow-y-scroll overflow-x-auto scrollbar-none'>
                    {selectedItem === 'Dashboard' && <Bord />}
                    {selectedItem === 'Clients' && <Clients />}
                    {selectedItem === 'Commandes' && <Commandes />}
                   
                    {selectedItem === 'Produits' && <Produits />}
                </div>
                
            </main>
        </div>
    );
}
