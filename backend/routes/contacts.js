const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to get a user's contacts
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const contacts = await db.query(
      `SELECT u.id, u.username
       FROM contacts c
       JOIN users u ON c.contact_id = u.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.status(200).json(contacts.rows);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

// Route to add a new contact
router.post('/add', async (req, res) => {
  const { userId, contactId } = req.body;
  try {
    await db.query(
      'INSERT INTO contacts (user_id, contact_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, contactId]
    );
    res.status(201).json({ message: 'Contact added successfully' });
  } catch (err) {
    console.error('Error adding contact:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

module.exports = router;