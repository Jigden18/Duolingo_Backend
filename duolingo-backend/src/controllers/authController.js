// src/controllers/authController.js

const signup = (req, res) => {
    const { email, password } = req.body;
  
    if (
      typeof email !== 'string' || email.trim() === '' ||
      typeof password !== 'string' || password.trim() === ''
    ) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    console.log('Signup data:', { email, password });
    res.status(200).json({ message: 'Signup successful!' });
  };  

  
  const login = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    res.status(200).json({ message: 'Login successful!' });
  };
  
  module.exports = { signup, login };
  
