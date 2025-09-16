const express = require('express');
const cors = require('cors'); // We need this for the frontend
const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');
const contactsRoutes = require('./routes/contacts');
const aiRoutes = require('./routes/ai');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for the frontend to communicate with the backend

// Use the new routers
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/contacts', contactsRoutes);


app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});