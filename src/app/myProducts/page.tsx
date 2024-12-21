'use client';

import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: string;
  link: string;
}

const MyProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/getProducts');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać produktów');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/deleteProduct`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się usunąć produktu');
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      alert('Produkt został usunięty.');
    } catch (error) {
      console.error('Błąd podczas usuwania produktu:', error);
      alert('Nie udało się usunąć produktu.');
    }
  };

  if (loading) return <p>Ładowanie produktów...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moje Produkty</h1>
      {products.length === 0 ? (
        <p>Brak produktów w bazie danych.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded-md shadow flex flex-col justify-between">
              <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-700 mb-2">Cena: {product.price}</p>
              <div className="flex flex-col">
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Zobacz produkt
              </a>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Usuń produkt
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
