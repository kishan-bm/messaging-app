const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Route to register a new user with password hashing
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).json({ error: 'Username already exists or a database error occurred.' });
  }
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const result = await db.query(
      `SELECT u.*, ud.phone_number FROM users u
       LEFT JOIN user_details ud ON u.id = ud.user_id
       WHERE u.username = $1 OR ud.phone_number = $1`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username/phone number or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, username: user.username, phone_number: user.phone_number }
      });
    } else {
      res.status(401).json({ error: 'Invalid username/phone number or password' });
    }
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

// New endpoint to create a contact with phone number
router.post('/create-contact', async (req, res) => {
    const { username, phoneNumber } = req.body;
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        let userId;
        const userCheck = await client.query('SELECT id FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length === 0) {
            const dummyPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            const userResult = await client.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
                [username || phoneNumber, dummyPassword]
            );
            userId = userResult.rows[0].id;
        } else {
            userId = userCheck.rows[0].id;
        }

        await client.query(
            'INSERT INTO user_details (user_id, phone_number) VALUES ($1, $2)',
            [userId, phoneNumber]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: 'Contact created successfully' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating contact:', err.message);
        if (err.message.includes('unique constraint "user_details_phone_number_key"')) {
            return res.status(409).json({ error: 'This phone number is already registered.' });
        }
        res.status(500).json({ error: 'A database error occurred.' });
    } finally {
        client.release();
    }
});

// Route to search for users
router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const result = await db.query(
      `SELECT u.id, u.username, ud.phone_number
       FROM users u
       LEFT JOIN user_details ud ON u.id = ud.user_id
       WHERE u.username ILIKE $1 OR ud.phone_number LIKE $1`,
      [`%${q}%`]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error searching for users:', err.message);
    res.status(500).json({ error: 'A database error occurred.' });
  }
});

router.post('/block', async (req, res) => {
  const { blockerId, blockedId } = req.body;
  try {
    await db.query('INSERT INTO blocked_users (blocker_id, blocked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [blockerId, blockedId]);
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (err) {
    console.error('Error blocking user:', err);
    res.status(500).json({ error: 'Failed to block user.' });
  }
});

router.get('/is-blocked/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    const result = await db.query('SELECT * FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2', [userId, contactId]);
    const isBlocked = result.rows.length > 0;
    res.status(200).json({ isBlocked });
  } catch (err) {
    console.error('Error checking block status:', err);
    res.status(500).json({ error: 'Failed to check block status.' });
  }
});

module.exports = router;