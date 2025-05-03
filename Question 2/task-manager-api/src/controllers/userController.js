const db = require('../config/db');

const getAllUsers = async (req, res) => {
  const { name } = req.query;
  let sql = 'SELECT * FROM users';
  const params = [];

  if (name && name.trim()) {
    sql += ' WHERE LOWER(username) LIKE ?';
    params.push(`%${name.trim().toLowerCase()}%`);
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const createUser = async (req, res) => {
  const { username, email } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const [result] = await db.query('INSERT INTO users (username, email) VALUES (?, ?)', [username, email || null]);
    res.status(201).json({ user_id: result.insertId, username, email });
  } catch (err) {
    console.error('DB error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
};

const updateUser = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
      [username, email || null, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user_id: userId, username, email });
  } catch (err) {
    console.error('DB error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `User ${req.params.id} deleted` });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};