const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to get a user's most recent chats
router.get('/recent-chats/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const chats = await db.query(
      `SELECT DISTINCT ON (chat_partner_id)
        chat_partner_id AS id,
        u.username,
        ud.phone_number,
        m.content,
        m.timestamp
      FROM (
        SELECT
            CASE
                WHEN sender_id = $1 THEN receiver_id
                ELSE sender_id
            END AS chat_partner_id,
            content,
            timestamp
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
      ) AS m
      JOIN users u ON m.chat_partner_id = u.id
      LEFT JOIN user_details ud ON u.id = ud.user_id
      ORDER BY chat_partner_id, timestamp DESC`,
      [userId]
    );
    res.status(200).json(chats.rows);
  } catch (err) {
    console.error('Error fetching recent chats:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

// Route to get chat history between two users
router.get('/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    const messages = await db.query(
      `SELECT * FROM messages WHERE 
       (sender_id = $1 AND receiver_id = $2) OR 
       (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp ASC`,
      [userId, contactId]
    );
    res.status(200).json(messages.rows);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

// Route to send a new message
router.post('/send', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [senderId, receiverId, content]
    );
    res.status(201).json({ message: 'Message sent successfully', message: result.rows[0] });
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

// Route to search for messages
router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const result = await db.query(
      `SELECT
        m.id,
        m.content,
        m.timestamp,
        u.username AS sender,
        r.username AS receiver
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.content ILIKE $1
       ORDER BY m.timestamp DESC`,
      [`%${q}%`]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error searching messages:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

// Route to delete all messages between two users
router.delete('/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    await db.query(
      `DELETE FROM messages WHERE 
       (sender_id = $1 AND receiver_id = $2) OR 
       (sender_id = $2 AND receiver_id = $1)`,
      [userId, contactId]
    );
    res.status(200).json({ message: 'Chat history deleted successfully' });
  } catch (err) {
    console.error('Error deleting chat history:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

// Route to delete a single message by its ID
router.delete('/:messageId', async (req, res) => {
  const { messageId } = req.params;
  try {
    await db.query('DELETE FROM messages WHERE id = $1', [messageId]);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

module.exports = router;