const API_URL = 'http://localhost:3000/api/productos';

let productos = [];
let modoEdicion = false;
let editandoId = null;

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje mensaje-${tipo}`;
    mensajeDiv.style.display = 'block';
    setTimeout(() => { mensajeDiv.style.display = 'none'; }, 3000);
}

function mostrarLoading() {
    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = '<tr><td colspan="5" class="cargando">Cargando productos...</td></tr>';
}

async function obtenerProductos() {
    mostrarLoading();
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        productos = await respuesta.json();
        renderizarTabla();
        if (productos.length === 0) {
            mostrarMensaje('No hay productos. ¡Crea el primero!', 'info');
        } else {
            mostrarMensaje(`${productos.length} productos cargados`, 'exito');
        }
    } catch (error) {
        console.error('Error GET:', error);
        mostrarMensaje('No se pudo conectar al servidor.', 'error');
        document.getElementById('cuerpoTabla').innerHTML =
            '<tr><td colspan="5" class="cargando" style="color:red">Error de conexión.</td></tr>';
    }
}

async function crearProducto(producto) {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.error || `Error ${respuesta.status}`);
        }
        const nuevoProducto = await respuesta.json();
        productos.unshift(nuevoProducto);
        renderizarTabla();
        mostrarMensaje(`"${producto.nombre}" creado exitosamente`, 'exito');
    } catch (error) {
        mostrarMensaje(`Error al crear: ${error.message}`, 'error');
        throw error;
    }
}

async function actualizarProducto(id, producto) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        const productoActualizado = await respuesta.json();

        // ✅ CORREGIDO: usar _id
        const index = productos.findIndex(p => p._id === id);
        if (index !== -1) {
            productos[index] = productoActualizado;
            renderizarTabla();
        }
        mostrarMensaje(`"${producto.nombre}" actualizado correctamente`, 'exito');
    } catch (error) {
        mostrarMensaje(`Error al actualizar: ${error.message}`, 'error');
        throw error;
    }
}

async function eliminarProducto(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);

        // ✅ CORREGIDO: usar _id
        productos = productos.filter(p => p._id !== id);
        renderizarTabla();
        mostrarMensaje(`"${nombre}" eliminado correctamente`, 'exito');

        if (modoEdicion && editandoId === id) cancelarEdicion();
    } catch (error) {
        mostrarMensaje(`Error al eliminar: ${error.message}`, 'error');
    }
}

function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function renderizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="cargando">No hay productos registrados</td></tr>';
        return;
    }
    tbody.innerHTML = productos.map(producto => `
        <tr>
            <td>${producto._id}</td>
            <td><strong>${escapeHtml(producto.nombre)}</strong></td>
            <td>$${parseFloat(producto.precio).toFixed(2)}</td>
            <td>${escapeHtml(producto.descripcion?.substring(0, 50) || 'Sin descripción')}...</td>
            <td>
                <button class="btn-editar" onclick="editarProducto('${producto._id}')">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto('${producto._id}', '${escapeHtml(producto.nombre)}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function editarProducto(id) {
    // ✅ CORREGIDO: usar _id
    const producto = productos.find(p => p._id === id);
    if (!producto) return;

    modoEdicion = true;
    editandoId = id;

    document.getElementById('productoId').value = producto._id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('descripcion').value = producto.descripcion || '';

    document.getElementById('formTitulo').textContent = 'Editar Producto';
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.textContent = 'Actualizar';
    btnGuardar.className = 'btn-actualizar';
    document.getElementById('btnCancelar').style.display = 'inline-block';

    document.querySelector('.formulario-card').scrollIntoView({ behavior: 'smooth' });
    mostrarMensaje(`Editando: ${producto.nombre}`, 'info');
}

function cancelarEdicion() {
    modoEdicion = false;
    editandoId = null;
    document.getElementById('productoForm').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('formTitulo').textContent = 'Nuevo Producto';
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.textContent = 'Guardar';
    btnGuardar.className = 'btn-guardar';
    document.getElementById('btnCancelar').style.display = 'none';
}

async function manejarSubmit(event) {
    event.preventDefault();
    const producto = {
        nombre: document.getElementById('nombre').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        descripcion: document.getElementById('descripcion').value.trim()
    };
    if (!producto.nombre) { mostrarMensaje('El nombre es obligatorio', 'error'); return; }
    if (isNaN(producto.precio) || producto.precio <= 0) { mostrarMensaje('El precio debe ser mayor a 0', 'error'); return; }

    const btnGuardar = document.getElementById('btnGuardar');
    const textoOriginal = btnGuardar.textContent;
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Procesando...';

    try {
        if (modoEdicion && editandoId) {
            await actualizarProducto(editandoId, producto);
            cancelarEdicion();
        } else {
            await crearProducto(producto);
            document.getElementById('productoForm').reset();
        }
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
    }
}

document.getElementById('productoForm').addEventListener('submit', manejarSubmit);
document.getElementById('btnCancelar').addEventListener('click', cancelarEdicion);

window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;

obtenerProductos();