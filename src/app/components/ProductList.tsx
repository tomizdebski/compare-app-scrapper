'use client';

import React from 'react';

interface Product {
  title: string;
  price: string;
  link: string;
}

interface ProductListProps {
  ebay: Product[];
  amazon: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ ebay, amazon }) => {
  const handleAddToDatabase = async (product: Product) => {
    try {
      const response = await fetch('/api/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Nie udało się dodać produktu');
      }

      const data = await response.json();
      console.log('Produkt dodany:', data);
      alert('Produkt został dodany do bazy!');
    } catch (error) {
      console.error('Błąd podczas dodawania produktu:', error);
      alert('Nie udało się dodać produktu.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold mb-2">eBay</h2>
        {ebay.length === 0 ? (
          <p>Brak wyników.</p>
        ) : (
          ebay.map((product, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md bg-slate-200">
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">
                {product.title}
              </a>
              <p className="text-gray-700">{product.price}</p>
              <button
                onClick={() => handleAddToDatabase(product)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Dodaj do bazy
              </button>
            </div>
          ))
        )}
      </div>
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold mb-2">Amazon</h2>
        {amazon.length === 0 ? (
          <p>Brak wyników.</p>
        ) : (
          amazon.map((product, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md bg-gray-100">
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">
                {product.title}
              </a>
              <p className="text-gray-700">{product.price}</p>
              <button
                onClick={() => handleAddToDatabase(product)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Dodaj do bazy
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;

