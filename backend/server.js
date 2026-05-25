const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./Contact');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/contactDB')
  .then(() => console.log('MongoDB Database connected successfully!'))
  .catch(err => console.error('Database connection error:', err));

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Our Contact Manager Server is running perfectly!');
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not save contact' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch contacts' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not delete contact' });
  }
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});