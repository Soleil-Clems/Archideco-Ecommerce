import React, { useState, useEffect } from 'react';

export default function Aside({ products, filters, setFilters }: { products: any[], filters: any, setFilters: any }) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        // Extraire les catégories uniques à partir des produits
        const uniqueCategories = Array.from(new Set(products.map(product => product.categoryTitle)));
        setCategories(uniqueCategories);
    }, [products]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCategory = event.target.value;
        const updatedCategories = filters.categories.includes(selectedCategory)
            ? filters.categories.filter((category: string) => category !== selectedCategory)
            : [...filters.categories, selectedCategory];

        setFilters({ ...filters, categories: updatedCategories });
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, price: event.target.value });
    };

    const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, weight: event.target.value });
    };

    return (
        <aside className="bg-slate-100 p-4 rounded-lg w-64">
            <h3 className="font-bold text-lg mb-4">Filtres</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700">Catégories</label>
                {categories.map((category, index) => (
                    <div key={`${category}-${index}`} className="mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                value={category}
                                checked={filters.categories.includes(category)}
                                onChange={handleCategoryChange}
                                className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2 text-sm text-zinc-700">{category}</span>
                        </label>
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700">Prix maximum: {filters.price} €</label>
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.price}
                    onChange={handlePriceChange}
                    className="w-full mt-1"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700">Poids maximum: {filters.weight} kg</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.weight}
                    onChange={handleWeightChange}
                    className="w-full mt-1"
                />
            </div>
        </aside>
    );
}
