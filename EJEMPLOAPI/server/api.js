// server/api.js
const express = require('express');
const cors = require('cors');
const path = require('path');  // ← NUEVO: Para manejar rutas

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ========== NUEVO: Servir archivos estáticos ==========
// Esto hace que los archivos de la carpeta "public" estén disponibles
app.use(express.static(path.join(__dirname, '../public')));

// Base de datos temporal (en memoria)
let productos = [
    { id: 1, nombre: "Laptop Gamer", precio: 15000, descripcion: "Alta potencia para gaming" },
    { id: 2, nombre: "Mouse RGB", precio: 500, descripcion: "Mouse con luces LED" }
];
let contadorId = 3;

// ========== ENDPOINTS DE LA API (ya los tienes) ==========

// GET - Obtener todos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// GET - Obtener uno
app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(producto);
});

// POST - Crear
app.post('/api/productos', (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    
    const nuevoProducto = {
        id: contadorId++,
        nombre,
        precio: parseFloat(precio),
        descripcion: descripcion || ''
    };
    
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

// PUT - Actualizar
app.put('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, precio, descripcion } = req.body;
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    productos[index] = {
        ...productos[index],
        nombre: nombre || productos[index].nombre,
        precio: precio !== undefined ? parseFloat(precio) : productos[index].precio,
        descripcion: descripcion !== undefined ? descripcion : productos[index].descripcion
    };
    
    res.json(productos[index]);
});

// DELETE - Eliminar
app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    productos.splice(index, 1);
    res.json({ mensaje: 'Producto eliminado' });
});

// ========== NUEVO: Ruta principal ==========
// Cuando alguien visite http://localhost:3000, mostrar index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n Servidor corriendo en http://localhost:${PORT}`);
    console.log('\n Endpoints de la API:');
    console.log('  GET    /api/productos');
    console.log('  POST   /api/productos');
    console.log('  PUT    /api/productos/:id');
    console.log('  DELETE /api/productos/:id');
    console.log('\n Abre el navegador en: http://localhost:3000\n');
});