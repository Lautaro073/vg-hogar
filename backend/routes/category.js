const express = require('express');
const db = require('../database');
const router = express.Router();
const verifyAdmin = require('../middlewares/middlewares');

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categorias ORDER BY nombre_categoria ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).send('Error al obtener las categorías');
    }
});

// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categorias WHERE id_categoria = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).send('Categoría no encontrada');
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).send('Error al obtener la categoría');
    }
});

// Crear una nueva categoría (protegida, solo admin)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        
        // Validación básica
        if (!nombre_categoria || nombre_categoria.trim() === '') {
            return res.status(400).send('El nombre de la categoría es requerido');
        }
        
        // Verificar si ya existe una categoría con ese nombre
        const [existing] = await db.query('SELECT * FROM Categorias WHERE nombre_categoria = ?', [nombre_categoria]);
        if (existing.length > 0) {
            return res.status(409).send('Ya existe una categoría con ese nombre');
        }
        
        // Crear la categoría
        const [result] = await db.query('INSERT INTO Categorias (nombre_categoria) VALUES (?)', [nombre_categoria]);
        
        res.status(201).json({
            id_categoria: result.insertId,
            nombre_categoria: nombre_categoria
        });
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).send('Error al crear la categoría');
    }
});

// Actualizar una categoría (protegida, solo admin)
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        const id_categoria = req.params.id;
        
        // Validación básica
        if (!nombre_categoria || nombre_categoria.trim() === '') {
            return res.status(400).send('El nombre de la categoría es requerido');
        }
        
        // Verificar si existe la categoría
        const [existing] = await db.query('SELECT * FROM Categorias WHERE id_categoria = ?', [id_categoria]);
        if (existing.length === 0) {
            return res.status(404).send('Categoría no encontrada');
        }
        
        // Verificar si ya existe otra categoría con ese nombre
        const [duplicate] = await db.query(
            'SELECT * FROM Categorias WHERE nombre_categoria = ? AND id_categoria != ?', 
            [nombre_categoria, id_categoria]
        );
        if (duplicate.length > 0) {
            return res.status(409).send('Ya existe otra categoría con ese nombre');
        }
        
        // Actualizar la categoría
        await db.query('UPDATE Categorias SET nombre_categoria = ? WHERE id_categoria = ?', [nombre_categoria, id_categoria]);
        
        res.json({
            id_categoria: parseInt(id_categoria),
            nombre_categoria
        });
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).send('Error al actualizar la categoría');
    }
});

// Eliminar una categoría (protegida, solo admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const id_categoria = req.params.id;
        
        // Verificar si existe la categoría
        const [existing] = await db.query('SELECT * FROM Categorias WHERE id_categoria = ?', [id_categoria]);
        if (existing.length === 0) {
            return res.status(404).send('Categoría no encontrada');
        }
        
        // Verificar si hay productos asociados a esta categoría
        const [products] = await db.query('SELECT COUNT(*) as count FROM Productos WHERE id_categoria = ?', [id_categoria]);
        if (products[0].count > 0) {
            return res.status(409).send('No se puede eliminar la categoría porque tiene productos asociados');
        }
        
        // Eliminar la categoría
        await db.query('DELETE FROM Categorias WHERE id_categoria = ?', [id_categoria]);
        
        res.send('Categoría eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).send('Error al eliminar la categoría');
    }
});

module.exports = router;