'use client';

import React, { useState } from 'react';

export default function ListForm({ onSubmit, placeholder = '' }) {
  const [name, setName] = useState('');

  const handle = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name);
    setName('');
  };

  return (
    <form onSubmit={handle} className="flex space-x-2">
      <input
        type="text"
        className="flex-1 px-2 py-1 border rounded focus:outline-none"
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="px-3 py-1 bg-blue-500 text-white rounded">Add</button>
    </form>
  );
}
