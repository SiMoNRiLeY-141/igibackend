const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');


const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
  'https://cqerwhnoxclumwgbunhe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZXJ3aG5veGNsdW13Z2J1bmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk1NDc1NjksImV4cCI6MjAxNTEyMzU2OX0.QCylENTnlAEzAFjbHOJNpjUcxI91yPKhQwPwULZ03qM'
);

// Sample route for user registration
app.post('/registration', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ user });
  } catch (error) {
    console.error('Error during registration:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sample route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error during login:', error);
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Verify token route
app.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const { user, error } = await supabase.auth.api.getUser(token);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sample route for fetching contacts
app.get('/contacts', async (req, res) => {
  try {
    // Fetch contacts from Supabase database
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*');

    if (error) {
      console.error('Error fetching contacts:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add more routes for managing contacts, etc.

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
