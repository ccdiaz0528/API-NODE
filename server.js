const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

let dbConnected = false;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia si usas otro usuario
    password: '', // Cambia si tienes contraseña
    database: 'miapi'
});

// Intentar conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos MySQL:', err.message || err);
        dbConnected = false;
        return;
    }
    dbConnected = true;
    console.log('Conectado a la base de datos MySQL');
});

// RUTAS CRUD

// GET - Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Conexión a la base de datos no disponible' });
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error en /usuarios GET:', err);
            return res.status(500).json({ error: err.message || 'Error al obtener usuarios' });
        }
        res.json(results);
    });
});

// POST - Crear un nuevo usuario
app.post('/usuarios', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Conexión a la base de datos no disponible' });
    const { nombre, email } = req.body;
    if (!nombre || !email) return res.status(400).json({ error: 'Faltan campos requeridos: nombre y email' });
    const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
    db.query(sql, [nombre, email], (err, result) => {
        if (err) {
            console.error('Error en /usuarios POST:', err);
            return res.status(500).json({ error: err.message || 'Error al crear usuario' });
        }
        res.status(201).json({ id: result.insertId, nombre, email });
    });
});

// PUT - Actualizar un usuario
app.put('/usuarios/:id', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Conexión a la base de datos no disponible' });
    const { nombre, email } = req.body;
    const sql = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
    db.query(sql, [nombre, email, req.params.id], (err, result) => {
        if (err) {
            console.error('Error en /usuarios PUT:', err);
            return res.status(500).json({ error: err.message || 'Error al actualizar usuario' });
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario actualizado correctamente' });
    });
});

// DELETE - Eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
    if (!dbConnected) return res.status(500).json({ error: 'Conexión a la base de datos no disponible' });
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error en /usuarios DELETE:', err);
            return res.status(500).json({ error: err.message || 'Error al eliminar usuario' });
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

// Middleware de manejo de errores de Express (por si alguna ruta llama next(err))
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: err && err.message ? err.message : 'Internal server error' });
});

// Capturar excepciones no manejadas para evitar que el proceso se termine silenciosamente
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});