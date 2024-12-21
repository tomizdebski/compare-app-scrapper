// app/components/SearchBar.tsx

'use client';

import React, { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Wprowadź nazwę produktu"
        className="flex-grow px-4 py-2 border rounded-l-md text-black"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-md">
        Szukaj
      </button>
    </form>
  );
};

export default SearchBar;
