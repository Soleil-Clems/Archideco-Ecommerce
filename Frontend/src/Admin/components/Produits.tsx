import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../hooks/AuthContext";

import { createSousCategory, getAllProducts, getCategories, getSousCategory, updateSousCategory } from '../../Requests/ProductsRequest';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createReduction } from '../../Requests/ReductionRequest';

export default function Produits() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedOnglet, setSelectedOnglet] = useState("Produits");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [weightFilter, setWeightFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(
    new Set()
  );
  const { authToken } = useContext(AuthContext);
  const productsPerPage = 20;
  const [endDate, setEndDate] = useState<string>('');
  const [reduction, setReduction] = useState<number>(0);
  const [title, setTitle] = useState<string>('')
  const [link, setLink] = useState<string>('')
  const [sousCategories, setSouscategories] = useState<any[]>([]);
  const [selectedSousCategory, setSelectedSousCategory] = useState<any | null>(null);
  const [checkedCategories, setCheckedCategories] = useState<{ [key: number]: boolean }>({});
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);


  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchSousCat();
  }, []);

  const fetchCategories = async () => {
    try {
      const data: any = await getCategories();
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSousCat = async () => {
    try {
      if (authToken) {
        const data: any = await getSousCategory(authToken);
        if (typeof data === "string") {
          console.error(data)
        } else {
          setSouscategories(data.data)
          // console.log(data.data)
        }

      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSousCategorySelect = (sousCategory: any) => {
    setSelectedSousCategory(sousCategory);

    const newCheckedCategories = sousCategory.categories.reduce((acc: any, category: any) => {
      acc[category.id] = true;
      return acc;
    }, {});

    setCheckedCategories(newCheckedCategories);
    setSelectedCategoryIds(sousCategory.categories.map((category: any) => category.id));
  };

  const handleCategoryCheck = (categoryId: number) => {
    setCheckedCategories(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));

    setSelectedCategoryIds(prevState =>
      prevState.includes(categoryId)
        ? prevState.filter(id => id !== categoryId)
        : [...prevState, categoryId]
    );
  };




  const handleCreateSousCat = async (sousCat: any) => {
    try {
      if (authToken) {
        const data: any = await createSousCategory(authToken, sousCat);
        console.log(data)
        if (typeof data === "string") {
          console.error(data)
        } else {
          fetchSousCat()
        }

      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateSousCat = async () => {
    try {
      if (authToken) {
        const data: any = await updateSousCategory(authToken, selectedSousCategory.id, selectedCategoryIds);
        if (typeof data === "string") {
          console.error(data)
        } else {
          console.log(data)
          // setSouscategories(data)
        }
        console.log(selectedCategoryIds)

  
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const data: any = await getAllProducts();
      // console.log(data)

      const cleanedData = data.map((product: any) => {
        const price = product.price || "";
        const weight = product.weight || "";

        let newPrice = price.split(" ")[0].replace(",", ".").trim();
        let newWeight = weight.replace("kg", "").trim();

        return {
          categoryId: product.categoryId,
          categoryTitle: product.categoryTitle,
          title: product.title,
          id: product.id,
          weight: newWeight,
          price: newPrice,
          reduction: product.reduction,
        };
      });

      setProducts(cleanedData);
      setFilteredProducts(cleanedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let filtered: any[] = products;

    if (categoryFilter) {
      filtered = filtered.filter(
        (product: any) => product.categoryTitle === categoryFilter
      );
    }

    if (nameFilter) {
      filtered = filtered.filter((product: any) => {
        const productName = product.title ? product.title.toLowerCase() : "";
        return productName.includes(nameFilter.toLowerCase());
      });
    }

    if (priceFilter) {
      filtered = filtered.filter((product: any) => {
        const price = parseFloat(product.price);
        return price <= parseFloat(priceFilter);
      });
    }

    if (weightFilter) {
      filtered = filtered.filter((product: any) => {
        const weight = parseFloat(product.weight);
        return weight <= parseFloat(weightFilter);
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setSelectedProductIds(new Set());
  }, [categoryFilter, nameFilter, priceFilter, weightFilter, products]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleCreateReduction = async (e: any) => {
    e.preventDefault();
    if (authToken && selectedProductIds.size > 0 && reduction > 0 && endDate) {
      try {
        const reductionData:any = {
          reduction,
          id_products: Array.from(selectedProductIds),
          end_at: endDate,
        };

        const data: any = await createReduction(authToken, reductionData);
        if (typeof data === "string") {
          console.log(data);
        } else {
          console.log(data);
          setSelectedProductIds(new Set())
          setReduction(0)
          setEndDate('')
          fetchProducts();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsModalOpen(false);
      }
      console.log(reduction, selectedProductIds.size, endDate);
    } else {
      alert("Veuillez remplir tous les champs nécessaires.");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSelectAllToggle = () => {
    if (allProductsSelected) {
      setSelectedProductIds(new Set());
    } else {
      const allProductIds = currentProducts.map((product: any) => product.id);
      setSelectedProductIds(new Set(allProductIds));
    }
  };

  const handleCheckboxChange = (productId: number) => {
    setSelectedProductIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(productId)) {
        newSelection.delete(productId);
      } else {
        newSelection.add(productId);
      }
      return newSelection;
    });
  };

  const allProductsSelected = currentProducts.every((product: any) =>
    selectedProductIds.has(product.id)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title && link) {

      const sousCat = {
        "title": title,
        "link": link
      }
      handleCreateSousCat(sousCat)
      console.log(sousCat)
    } else {
      console.log("Remplir tous les champs")
    }
  }

  return (
    <div>

      <div className="flex justify-center p-4 text-white">
        {/* <div
          className={`px-4 py-2 rounded-tl-md rounded-bl-md ${
            selectedOnglet === "Categories"
              ? "bg-red-500"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setSelectedOnglet("Categories")}
        >
          Categories
        </div>
        <div
          className={`px-4 py-2 rounded-tr-md rounded-br-md ${
            selectedOnglet === "Produits"
              ? "bg-blue-500"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setSelectedOnglet("Produits")}
        >
          Produits
        </div> */}
      </div>

      {selectedOnglet === "Categories" ? (
        <div className="">
          <div className="flex justify-center">

            <div>
              <h1 className="flex justify-center text-xl text-teal-500 font-bold p-4">Gestion des sous categories</h1>
              <div className="flex flex-col gap-2">
                <form className="flex w-full justify-center gap-2 mb-4" action="" onSubmit={handleSubmit}>
                  <div>
                    <input
                      className="flex border border-sm rounded-md p-1.5"
                      type="text"
                      name="" placeholder="Sous categorie"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className="flex border border-sm rounded-md p-1.5"
                      type="text"
                      name=""
                      placeholder="Link"
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                  <div>
                    <button className="flex bg-teal-500 text-white w-full justify-center p-1.5 rounded-md">Creer</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex p-4 gap-2">
            <div className="bg-slate-100 shadow-xl py-2">

              <ul className="flex flex-col gap-2">
                {sousCategories.map((sousCategory: any) => (
                  <li
                    key={sousCategory.id}
                    className={`cursor-pointer px-4 ${selectedSousCategory?.id === sousCategory.id ? 'bg-slate-300 rounded-md' : ''}`}
                    onClick={() => handleSousCategorySelect(sousCategory)}
                  >
                    {sousCategory.title}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-muted text-muted-foreground">
                    <th className="py-2 px-4 border-b text-left">
                      <input
                        type="checkbox"

                      />
                    </th>
                    <th className="py-2 px-4 border-b text-left">id</th>
                    <th className="py-2 px-4 border-b text-left">Categorie</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category: any) => (
                    <tr key={category.id} className="hover:bg-muted/20">
                      <td className="py-2 px-4 border-b">
                        <input
                          type="checkbox"
                          checked={!!checkedCategories[category.id]}
                          onChange={() => handleCategoryCheck(category.id)}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">{category.id}</td>
                      <td className="py-2 px-4 border-b">{category.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <ul>
                {selectedCategoryIds.map(id => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
              <div>
                <button
                  className="bg-teal-500 text-white"
                  onClick={()=>handleUpdateSousCat()}
                >Lier les donnees</button>
              </div>
            </div>

          </div>
        </div>
      ) : (

        <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md">
          <h1 className="flex justify-center text-xl text-teal-500 font-bold p-4">Gestion des produits</h1>
          <div className="flex flex-col md:flex-row mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <Search className="text-gray-700" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="border p-2 rounded-md"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Prix max"
                className="border p-2 rounded-md"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              />
              <input
                type="number"
                placeholder="Poids max (kg)"
                className="border p-2 rounded-md"
                value={weightFilter}
                onChange={(e) => setWeightFilter(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-700" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border p-2 rounded-md"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                <th className="py-2 px-4 border-b text-left">
                  <input
                    type="checkbox"
                    checked={allProductsSelected}
                    onChange={handleSelectAllToggle}
                    disabled={currentProducts.length === 0}
                  />
                </th>
                <th className="py-2 px-4 border-b text-left">Produit</th>
                <th className="py-2 px-4 border-b text-left">Catégorie</th>
                <th className="py-2 px-4 border-b text-left">Prix</th>
                <th className="py-2 px-4 border-b text-left">Poids</th>
                <th className="py-2 px-4 border-b text-left">Réduction</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product: any) => (
                <tr key={product.id} className="hover:bg-muted/20">
                  <td className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.has(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/product/${product.categoryTitle}/${product.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {product.categoryTitle}
                  </td>
                  <td className="py-2 px-4 border-b">{product.price} €</td>
                  <td className="py-2 px-4 border-b">{product.weight} kg</td>
                  <td className="py-2 px-4 border-b">{product.reduction} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-2 rounded-md justify-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-1 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-teal-500 text-white'
                }`}

            >
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200' : 'bg-teal-500 text-white'
                }`}
            >
              Suivant
            </button>
          </div>

          <div className="flex justify-center mt-4">
            {
              selectedProductIds.size > 0 ?
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                // disabled={selectedProductIds.size === 0}
                >
                  Créer une réduction
                </button> : ""
            }
          </div>

        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">

            <h2 className="text-lg font-semibold mb-4"

            >
              Créer une Réduction
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Réduction (euro)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="border p-2 rounded-md w-full"
                value={reduction}
                onChange={(e) => setReduction(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                className="border p-2 rounded-md w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={(e: any) => handleCreateReduction(e)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
