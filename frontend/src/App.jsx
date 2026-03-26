import React, { useState, useEffect } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '' });
  
  const API_URL = 'http://localhost:5000/api';

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return fetchProducts();
    const res = await fetch(`${API_URL}/search?q=${searchQuery}`);
    const data = await res.json();
    setProducts(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', description: '', category: '', price: '' }); 
    fetchProducts(); 
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleUpdate = async (id, oldPrice) => {
    const newPrice = prompt('Enter new price:', oldPrice);
    if (!newPrice || isNaN(newPrice)) return;
    
    await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: Number(newPrice) })
    });
    fetchProducts();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Product Inventory Manager</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <form onSubmit={handleCreate} style={{ marginBottom: '30px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Add New Product</h3>
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit">Add</button>
      </form>

 
      <div style={{ display: 'grid', gap: '15px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid black', padding: '15px', borderRadius: '5px' }}>
            <h3>{product.name} - ${product.price}</h3>
            <p><strong>Category:</strong> {product.category}</p>
            <p>{product.description}</p>
            <button onClick={() => handleUpdate(product._id, product.price)}>Edit Price</button>
            <button onClick={() => handleDelete(product._id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
          </div>
        ))}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
};

export default App;