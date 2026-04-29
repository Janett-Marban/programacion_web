// 1. MODO OSCURO 
document.addEventListener("DOMContentLoaded", function () {
    const savedTheme = localStorage.getItem("theme");
    const btn = document.getElementById("btnModo");

    if (savedTheme === "dark") {
        document.body.classList.add("oscuro");
        if (btn) btn.textContent = "☀️";
    } else {
        if (btn) btn.textContent = "🌙";
    }
});

function cambiarModo() {
    const body = document.body;
    const btn = document.getElementById("btnModo");

    body.classList.toggle("oscuro");

    if (body.classList.contains("oscuro")) {
        localStorage.setItem("theme", "dark");
        btn.textContent = "☀️"; // sol
    } else {
        localStorage.setItem("theme", "light");
        btn.textContent = "🌙"; // luna
    }
}

// 2. BOTÓN VOLVER ARRIBA 
let scrollTopBtn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollTopBtn?.classList.add('mostrar');
    } else {
        scrollTopBtn?.classList.remove('mostrar');
    }
});
scrollTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 3. VALIDACIÓN FORMULARIO
// VALIDACIÓN FORMULARIO COMPLETA
function validarFormulario(event) {
    event.preventDefault(); // Evita envío
    
    // 1. NOMBRE
    const nombre = document.getElementById('nombre');
    if (!nombre || !nombre.value.trim()) {
        alert('❌ ¡Nombre es obligatorio!');
        nombre.focus();
        return false;
    }
    
    // 2. EMAIL
    const email = document.getElementById('email');
    if (!email || !email.value.trim()) {
        alert('❌ ¡Email es obligatorio!');
        email.focus();
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        alert('❌ ¡Email inválido! (ej: usuario@dominio.com)');
        email.focus();
        return false;
    }
    
    // 3. TÉRMINOS
    const terminos = document.getElementById('terminos');
    if (!terminos || !terminos.checked) {
        alert('❌ ¡Debes aceptar términos y condiciones!');
        terminos.focus();
        return false;
    }
    
    // 4. AL MENOS 1 CHECKBOX
    const checkboxes = document.querySelectorAll('input[name="problemas[]"]:checked');
    if (checkboxes.length === 0) {
        alert('❌ ¡Selecciona al menos 1 problema de salud!');
        return false;
    }
    
    // ✅ TODO OK
    alert('✅ ¡Formulario enviado correctamente! Gracias por participar.');
    return true; // Permite envío (o puedes hacer fetch aquí)
}

// 4. LISTA DINÁMICA
function agregarMarca() {
    const input = document.getElementById('nuevaMarca');
    const lista = document.getElementById('listaMarcas');
    const marca = input.value.trim();
    
    if (marca) {
        const li = document.createElement('li');
        li.textContent = marca;
        lista.appendChild(li);
        input.value = '';
    }
}

// GALERÍA PRODUCTOS
function cambiarProducto(src) {
    document.getElementById('imgProductoPrincipal').src = src;
    // Efecto hover en miniaturas
    document.querySelectorAll('[onclick*="cambiarProducto"]').forEach(img => {
        img.style.borderColor = 'transparent';
    });
    event.target.style.borderColor = 'var(--color-rojo)';
}

// 6. CONTADOR CHECKBOXES
document.addEventListener('change', function(e) {
    if (e.target.name === 'problemas[]') {
        const checkboxes = document.querySelectorAll('input[name="problemas[]"]:checked');
        document.getElementById('contador').textContent = checkboxes.length;
    }
});

// 7. BOTÓN ME GUSTA (index.html - header)
function likePost() {
    let likes = parseInt(localStorage.getItem('likes')) || 0;
    likes++;
    localStorage.setItem('likes', likes);
    document.getElementById('contadorLikes').textContent = likes;
}
// Carga likes al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const likes = localStorage.getItem('likes') || 0;
    document.getElementById('contadorLikes') && (document.getElementById('contadorLikes').textContent = likes);
});

// 8. CARRUSEL CON AUTO-PLAY
let carruselIndex = 0;
const carruselImgs = ['coca.webp', 'fanta.jpg', 'fuze tea.jpg', 'sprice.jpg', 'santaclara.webp', 'topochico.webp', 'POWERADE.webp', 'alcolica.webp', 'delvalle.webp'];

function actualizarCarrusel() {
    const img = document.getElementById('carruselImg');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = carruselImgs[carruselIndex];
        img.style.opacity = '1';
    }, 200);
}

function nextImg() {
    carruselIndex = (carruselIndex + 1) % carruselImgs.length;
    actualizarCarrusel();
}

function prevImg() {
    carruselIndex = (carruselIndex - 1 + carruselImgs.length) % carruselImgs.length;
    actualizarCarrusel();
}

// Cambia solo automáticamente cada 3 segundos
setInterval(nextImg, 3000);



// CONFIRMAR ENLACES EXTERNOS
document.addEventListener('DOMContentLoaded', function() {
    // Detectar TODOS los enlaces externos
    document.querySelectorAll('a[href^="http"]:not([href*="tu-dominio.com"])').forEach(enlace => {
        enlace.addEventListener('click', function(event) {
            // Solo enlaces que NO son del mismo dominio
            if (this.hostname !== location.hostname && this.hostname !== '') {
                event.preventDefault(); // Detiene navegación
                
                const confirmed = confirm('¿Estás seguro de que deseas salir de este sitio?\n\n' + this.href);
                if (confirmed) {
                    window.open(this.href, '_blank'); // Abre en nueva pestaña
                }
            }
        });
    });
});