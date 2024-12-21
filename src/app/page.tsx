// app/page.tsx

"use client";

import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import axios from "axios";

interface Product {
  title: string;
  price: string;
  link: string;
}

interface SearchResponse {
  ebay: Product[];
  amazon: Product[];
  error?: string;
}

const Home: React.FC = () => {
  const [ebay, setEbay] = useState<Product[]>([]);
  const [amazon, setAmazon] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setEbay([]);
    setAmazon([]);

    try {
      const response = await axios.get<SearchResponse>("/api/searchProducts", {
        params: { query },
      });

      if (response.status === 200) {
        setEbay(response.data.ebay);
        setAmazon(response.data.amazon);
      } else {
        setError(response.data.error || "Błąd podczas wyszukiwania");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Wystąpił błąd sieciowy");
      } else {
        setError("Wystąpił błąd sieciowy");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl font-bold mb-4">
        Porównywarka Ofert eBay i Amazon
      </h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Ładowanie...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ProductList ebay={ebay} amazon={amazon}/>
    </div>
  );
};

export default Home;
