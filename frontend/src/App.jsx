import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:5000/api/contacts';

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_URL);
      setContacts(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return alert("Please fill all fields!");

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { name, email, phone });
        setEditId(null);
      } else {
        await axios.post(API_URL, { name, email, phone });
      }
      setName(''); setEmail(''); setPhone('');
      fetchContacts();
    } catch (error) {
      alert("Error saving contact!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchContacts();
    }
  };

  const handleEdit = (contact) => {
    setEditId(contact._id);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2>Contact Manager</h2>
      
      {/* Contact Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '8px' }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px' }} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', background: 'skyblue', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {editId ? 'Update Contact' : 'Add Contact'}
        </button>
      </form>

      {/* Contact List */}
      <h3>All Contacts</h3>
      <ul style={{ padding: 0 }}>
        {contacts.map((c) => (
          <li key={c._id} style={{ listStyle: 'none', borderBottom: '1px solid #ccc', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{c.name}</strong> <br />
              <small>{c.phone} | {c.email}</small>
            </div>
            <div>
              <button onClick={() => handleEdit(c)} style={{ marginRight: '5px' }}>Edit</button>
              <button onClick={() => handleDelete(c._id)} style={{ color: 'red' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;