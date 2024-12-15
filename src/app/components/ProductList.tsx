// app/components/ProductList.tsx

'use client';

import React from 'react';

interface Product {
  title: string;
  price: string;
  link: string;
}

interface ProductListProps {
  ebay: Product[];
  allegro: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ ebay, allegro }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold mb-2">eBay</h2>
        {ebay.length === 0 ? (
          <p>Brak wyników.</p>
        ) : (
          ebay.map((product, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">
                {product.title}
              </a>
              <p className="text-gray-700">{product.price}</p>
            </div>
          ))
        )}
      </div>
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold mb-2">Allegro</h2>
        {allegro.length === 0 ? (
          <p>Brak wyników.</p>
        ) : (
          allegro.map((product, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">
                {product.title}
              </a>
              <p className="text-gray-700">{product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
