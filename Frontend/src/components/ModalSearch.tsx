import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts } from "../Requests/ProductsRequest";
import { Product } from "../Types/category";
import Card from "./Card";

interface MobileSearch {
  mobile: boolean;
}

export default function ModalSearch(mobile: MobileSearch) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [productFilter, setProductFilter] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const searching = (target: string) => {
    setSearch(target);
    const data = products.filter(
      (product) =>
        (product.title &&
          product.title.toLowerCase().includes(target.toLowerCase())) ||
        (product.description &&
          product.description.toLowerCase().includes(target.toLowerCase()))
    );
    setProductFilter(data);
  };
  function handleAddToCart(id: number) {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <label
        className="btn bg-transparent flex flex-col items-center"
        htmlFor="modal-1"
      >
        <Search color="#639d87" />
        {mobile ? (
          <p className="font-semibold text-sm hover:underline-offset-4 hover:underline">
            Recherche
          </p>
        ) : (
          <p className="font-semibold text-sm hover:underline-offset-4 hover:underline">
            Recherchez votre produit
          </p>
        )}
      </label>
      <input className="modal-state hidden" id="modal-1" type="checkbox" />
      <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <label
          className="modal-overlay absolute w-full h-full"
          htmlFor="modal-1"
        ></label>
        <div className="modal-content bg-white rounded-lg p-6 w-full max-w-lg relative">
          <label
            htmlFor="modal-1"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
          <h2 className="text-xl mb-4 font-semibold">Liste des produits</h2>
          <div className="flex flex-col items-center justify-center w-full gap-3">
            <input
              type="text"
              placeholder="Mixeur, lave-linge, Machine à café..."
              className="bg-transparent border-2 border-green-duck h-10 w-full text-black rounded-md text-sm px-3"
              onChange={(e) => searching(e.target.value)}
              value={search}
            />
            <section className="w-full h-auto flex flex-col gap-6 items-center justify-center overflow-y-auto mt-4">
              {productFilter.length > 0 ? (
                productFilter.map((product, key) => (
                  <Card
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    note={9}
                    reduction={0}
                    product={product}
                    onAddToCart={() => handleAddToCart(product.id)}
                  />
                ))
              ) : (
                <p className="text-gray-600 text-sm">Aucun produit trouvé.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
