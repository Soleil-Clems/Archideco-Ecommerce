import Logo from "../assets/LogoArchideco.png";
import {
  CircleHelp,
  MapPin,
  ShoppingBasket,
  User,
  Menu,
  LayoutGrid,
  X,
  Heart,
  ShieldCheck,
  DoorOpen,
  CircleUserRound
} from "lucide-react";
import Accordions from "../UI/Accordion";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalSearch from "./ModalSearch";
import { AuthContext } from "../hooks/AuthContext";
import decodeToken from "../hooks/DecodeToken";
import { useConnected } from "../hooks/Connected";

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const { authToken } = useContext<any>(AuthContext);
  const decodedToken = authToken ? decodeToken(authToken) : null;
  const roles = decodedToken ? decodedToken.roles : [];
  const navigate = useNavigate();
  const connected = useConnected();

  function deconnexion() {
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload();
  }

  function openMenu() {
    open ? setOpen(false) : setOpen(true);
  }
  return (
    <header className="font-Gotham">
      <nav className=" hidden lg:block w-screen min-h-14 h-auto pt-2 bg-white py-4 ">
        <section className="flex flex-row items-center justify-around px-2 pr-14">
          <Link to="/">
            <img src={Logo} alt="Logo" height={100} width={100} />
          </Link>
          <div className={`flex flex-col items-center`}>
            <ModalSearch mobile={false} />
          </div>
          <p className="bg-black/20 w-0.5 h-8"></p>
          <Link to="/FAQ" className="flex flex-col items-center">
            <CircleHelp color="#639d87" />
            <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
              Foire aux questions
            </div>
          </Link>
          <p className="bg-black/20 w-0.5 h-8"></p>

          <Link to="/map" className="flex flex-col items-center">
            <MapPin color="#639d87" />

            <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
              Nous localiser
            </div>
          </Link>
          <p className="bg-black/20 w-0.5 h-8"></p>

          <Link to="/envies" className="flex flex-col items-center">
            <Heart color="#639d87" />
            <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
              Mes envies
            </div>
          </Link>
          <p className="bg-black/20 w-0.5 h-8"></p>

          <Link to="/cart" className="flex flex-col items-center">
            <ShoppingBasket color="#639d87" />
            <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
              Mon panier
            </div>
          </Link>
          <p className="bg-black/20 w-0.5 h-8"></p>

          {roles.includes("ROLE_ADMIN") && connected ? (
            <>
              <Link
                to="/admin/dashboard"
                className="flex flex-col items-center"
              >
                <ShieldCheck color="#639d87" />
                <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
                  Dashboard
                </div>
              </Link>
              <p className="bg-black/20 w-0.5 h-8"></p>
            </>
          ) : null}

          {connected && roles.includes("ROLE_USER") ? (
            <>
              <Link to="/profil" className="flex flex-col items-center">
                <CircleUserRound color="#639d87" />
                <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
                  Profil
                </div>
              </Link>
              <p className="bg-black/20 w-0.5 h-8"></p>
            </>
          ) : null}

          {connected ? (
            <div
              className="flex flex-col items-center hover:cursor-pointer"
              onClick={() => deconnexion()}
            >
              <DoorOpen color="#639d87" />
              <div className="font-semibold text-sm hover:underline-offset-4 hover:underline text-red-500">
                Déconnexion
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex flex-col items-center">
              <User color="#639d87" />
              <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
                Connectez-vous!
              </div>
            </Link>
          )}
        </section>
        <section className="flex flex-row w-full items-center justify-start gap-10 px-8 pt-6">
          <LayoutGrid />
          <Link
            className="font-medium  text-md hover:underline-offset-4 hover:underline decoration-green-800"
            to="/products/pem"
          >
            Petit électroménager
          </Link>
          <p className="bg-black/10 w-0.8 h-6"></p>
          <Link
            className="font-medium  text-md hover:underline-offset-4 hover:underline decoration-green-800"
            to="/products/gem"
          >
            Gros électroménager
          </Link>
          <p className="bg-black/10 w-0.8 h-6"></p>
          <Link
            className="font-medium text-md hover:underline-offset-4 hover:underline decoration-green-800"
            to="/meubles"
          >
            Aménagement intérieur
          </Link>
        </section>
      </nav>
      {/* ////////mobile/////////// */}
      <nav className={`block lg:hidden bg-white`}>
        <section className="relative flex items-center gap-6 pl-4">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="relative"
              height={80}
              width={80}
            />
          </Link>
          <X
            size={28}
            onClick={openMenu}
            className={`absolute right-10 transition-opacity duration-300 ease-in-out ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />
          <Menu
            size={28}
            onClick={openMenu}
            className={`absolute  right-10 transition-opacity duration-300 ease-in-out ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
        </section>
      </nav>

      {open && (
        <section
          className={` bg-white block lg:hidden h-auto w-full bg-white/20 relative transition-opacity duration-300 ease-in-out `}
        >
          <div className="h-auto grid grid-cols-2 grid-rows-2 sm:grid-cols-4  gap-4 pt-2 py-2 bg-white">
            <div className="flex flex-col items-center">
              <CircleHelp color="#639d87" />
              <Link
                className="font-semibold text-xs hover:underline-offset-4 hover:underline"
                to="/FAQ"
              >
                Foire aux questions
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <MapPin color="#639d87" />
              <Link
                className="font-semibold text-xs hover:underline-offset-4 hover:underline"
                to="/map"
              >
                Nous localiser
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <User color="#639d87" />
              <Link
                className="font-semibold text-xs hover:underline-offset-4 hover:underline"
                to="/login"
              >
                Connectez-vous!
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <Heart color="#639d87" />
              <Link
                className="font-semibold text-xs hover:underline-offset-4 hover:underline"
                to="/envies"
              >
                Mes envies
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <ModalSearch mobile={true} />
            </div>

            <div className="flex flex-col items-center">
              <ShoppingBasket color="#639d87" />
              <Link
                className="font-semibold text-xs hover:underline-offset-4 hover:underline"
                to="/cart"
              >
                Mon panier
              </Link>
            </div>
            {roles.includes("ROLE_ADMIN") ? (
              <Link
                to="/admin/dashboard"
                className="flex flex-col items-center"
              >
                <ShieldCheck color="#639d87" />
                <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
                  Dashboard
                </div>
              </Link>
            ) : (
              ""
            )}
            {connected && roles.includes("ROLE_USER") ? (
              <>
                <Link to="/profil" className="flex flex-col items-center">
                  <ShieldCheck color="#639d87" />
                  <div className="font-semibold text-sm hover:underline-offset-4 hover:underline">
                    Profil
                  </div>
                </Link>
                <p className="bg-black/20 w-0.5 h-8"></p>
              </>
            ) : null}
          </div>
          <Accordions />
        </section>
      )}
    </header>
  );
}
