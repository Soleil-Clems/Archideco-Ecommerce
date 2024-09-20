import { useEffect, useState, useContext } from "react";
import { getGem, getPem, getCuisine } from "../Requests/ProductsRequest";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Aside from "../components/Aside";
import { AuthContext } from "../hooks/AuthContext";
import { useToast } from "@chakra-ui/react";
import { getMyCart, createCart, updateCart } from "../Requests/CartRequest";
import { Navigate, useParams } from "react-router-dom";
import { CreateCartBody } from "../Types/cartCrud";

export default function ProductListPage() {
  const { category } = useParams();
  const allowedCategory = ["pem", "gem", "interieur"];
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<{
    categories: string[];
    price: string;
    weight: string;
  }>({
    categories: [],
    price: "20000",
    weight: "1000",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(24);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const { authToken } = useContext(AuthContext);
  const toast = useToast();
  const [cart, setCart] = useState<any | null>(null);

  useEffect(() => {
    if (!category || !allowedCategory.includes(category)) {
      setNotFound(true);
      return;
    }

    handleGetProduct();
    handleGetMyCart();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const handleCreateCart = async (idProduct: number) => {
    try {
      if (authToken) {
        const cartData: CreateCartBody = {
          idProducts: [idProduct],
        };
        const data: any | string = await createCart(authToken, cartData);
        if (typeof data === "string") {
          setError(data);

          toast({
            title: data,
            description: "",
            status: "error",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
        } else {
          setCart(data.data);
          const currentProduct = products.find(
            (product) => product.id === idProduct
          );

          toast({
            title: "Félicitations",
            position: "top",
            description: `${currentProduct?.title} ajouté au panier`, 
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
      }
    } catch (err) {
      setError("Erreur lors de la création du panier");
      console.error("Erreur:", err);
    }
  };

  const handleUpdateCart = async (idProduct: number) => {
    try {
      if (authToken) {
        let newProducts = cart?.id_products;
        newProducts.push(idProduct);
        const updateData: CreateCartBody = {
          idProducts: newProducts,
        };
        let id = cart?.id;
        const data: any | string = await updateCart(authToken, id, updateData);
        if (typeof data === "string") {
          setError(data);
          console.log("error", data);
          toast({
            title: data,
            description: "",
            status: "error",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
        } else {
          setCart(data);
          const currentProduct = products.find(
            (product) => product.id === idProduct
          );

          toast({
            title: "Félicitations",
            position: "top",
            description: `${currentProduct?.title} ajouté au panier`, // Utilisez le titre du produit ici
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          console.log(cart);
        }
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du panier");
      console.error("Erreur:", err);
    }
  };

  const handleGetMyCart = async () => {
    try {
      if (authToken) {
        const data: any | string = await getMyCart(authToken);
        if (typeof data === "string") {
          setCart(null);
          setError(data);
        } else {
          setCart(data.data);
          // console.log(data.data);
        }
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du panier");
      console.error("Erreur:", err);
    }
  };

  const handleGetProduct = async () => {
    try {
      let data: any;
      switch (category) {
        case "gem":
          data = await getGem();
          // console.log(data)
          break;
        case "pem":
          data = await getPem();
          break;
        case "interieur":
          data = await getCuisine();
          break;
        default:
          setNotFound(true);
          break;
      }
      const shuffledProducts = shuffleProduct(data);
      setProducts(shuffledProducts);
      setFilteredProducts(shuffledProducts);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const shuffleProduct = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const applyFilters = () => {
    let filtered = products;

    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.categoryTitle)
      );
    }

    if (filters.price) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(filters.price)
      );
    }

    if (filters.weight) {
      filtered = filtered.filter(
        (product) => parseFloat(product.weight) <= parseFloat(filters.weight)
      );
    }

    setFilteredProducts(filtered);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts =
    filteredProducts.length <= productsPerPage
      ? filteredProducts
      : filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (notFound) {
    return <Navigate to="/sorry/notfound" />;
  }

  const handleAddToCart = (idProduct: number) => {
    if (!cart) {
      handleCreateCart(idProduct);
    } else {
      handleUpdateCart(idProduct);
    }
  };

  if (error) {
    console.log(error);
  }
  return (
    <div className="bg-white w-screen overflow-x-hidden min-h-dvh h-auto text-black">
      <Navbar />
      <main className="h-auto min-w-screen mt-6 px-4 flex gap-4">
        <Aside products={products} filters={filters} setFilters={setFilters} />
        <div className="flex-1">
          <div className="p-4 grid justify-center items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentProducts.map((product: any) => (
              <Card
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                note={9}
                reduction={product.reduction}
                product={product}
              />
            ))}
          </div>
          {filteredProducts.length > productsPerPage && (
            <div className="flex justify-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gray-300 text-black rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Précédent
              </button>
              {[...Array(totalPages).keys()].map((pageNumber) => (
                <button
                  key={pageNumber + 1}
                  onClick={() => setCurrentPage(pageNumber + 1)}
                  className={`px-4 py-2 ${
                    currentPage === pageNumber + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  } rounded-none hover:bg-gray-400`}
                >
                  {pageNumber + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-gray-300 text-black rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
