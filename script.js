document.addEventListener("DOMContentLoaded", () => {
    // Configuración inicial
    const form = document.getElementById("contacto");

    // Ruta del archivo JSON
    const JSON_URL = "./productos.json"; 

    // Validar formulario de contacto
    form?.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevenir el envío del formulario

        const nombre = document.getElementById("nombre")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const mensaje = document.getElementById("mensaje")?.value.trim();

        if (nombre && email && mensaje) {
            console.log("Todos los campos están completos.");
        } else {
            console.log("Por favor, complete todos los campos del formulario.");
        }
    });

    // Función para cargar productos desde JSON
    async function cargarProductos() {
        try {
            const respuesta = await fetch(JSON_URL); // Solicitud al archivo JSON
            if (!respuesta.ok) {
                throw new Error(`Error al cargar el JSON: ${respuesta.status}`);
            }
            const productos = await respuesta.json(); // Convertir respuesta en JSON
            mostrarProductos(productos); // Mostrar productos en la página
            console.log("Productos cargados exitosamente.");
        } catch (error) {
            console.error("Error al cargar productos:");
            mostrarError("No se pudieron cargar los productos.");
        }
    }

    // Función para mostrar los productos
    function mostrarProductos(productos) {
        const contenedor = document.querySelector(".productos-container");

        if (!contenedor) {
            console.error("El contenedor de productos no existe.");
            return;
        }

        productos.forEach((producto) => {
            const tarjetaHTML = `
                <div class="producto-card">
                    <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" width="300" height="200">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p><strong>Precio:</strong> $${producto.precio}</p>
                    <button class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
                </div>
            `;
            contenedor.innerHTML += tarjetaHTML;
        });
    }

    // Añadir eventos a los botones después de generar las tarjetas
    document.querySelectorAll(".agregar-carrito").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const productoId = e.target.dataset.id;
            agregarAlCarrito(productoId);
        });
    });

    // Función para mostrar errores en el contenedor
    function mostrarError(mensaje) {
        const contenedor = document.querySelector(".productos-container");
        if (contenedor) {
            contenedor.innerHTML = `<p class="error">${mensaje}</p>`;
        }
    }

    // Llamar a la carga de productos
    cargarProductos();
});

function agregarAlCarrito(productoId) {
    // Recuperar carrito actual desde localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find((producto) => producto.id == productoId);

    if (productoEnCarrito) {
        // Si ya está, aumenta la cantidad
        productoEnCarrito.cantidad++;
    } else {
        // Si no está, obtén la información del producto y agrégalo
        const producto = productos.find((p) => p.id == productoId);
        carrito.push({ ...producto, cantidad: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    console.log("Producto añadido al carrito:", productoId);
}

function mostrarCarrito() {
    const carritoContainer = document.querySelector(".carrito-container");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Limpiar contenedor antes de mostrar el carrito actualizado
    carritoContainer.innerHTML = "";

    if (carrito.length === 0) {
        carritoContainer.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    // Generar HTML para cada producto del carrito
    carrito.forEach((producto) => {
        const productoHTML = `
            <div class="carrito-item">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Cantidad: 
                    <button class="decrementar" data-id="${producto.id}">-</button>
                    ${producto.cantidad}
                    <button class="incrementar" data-id="${producto.id}">+</button>
                </p>
                <button class="eliminar" data-id="${producto.id}">Eliminar</button>
            </div>
        `;
        carritoContainer.innerHTML += productoHTML;
    });

    // Añadir eventos para editar/eliminar productos
    document.querySelectorAll(".incrementar").forEach((boton) =>
        boton.addEventListener("click", (e) => editarCantidad(e.target.dataset.id, 1))
    );
    document.querySelectorAll(".decrementar").forEach((boton) =>
        boton.addEventListener("click", (e) => editarCantidad(e.target.dataset.id, -1))
    );
    document.querySelectorAll(".eliminar").forEach((boton) =>
        boton.addEventListener("click", (e) => eliminarProducto(e.target.dataset.id))
    );
}


function editarCantidad(productoId, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carrito.map((producto) => {
        if (producto.id == productoId) {
            return { ...producto, cantidad: Math.max(1, producto.cantidad + cambio) };
        }
        return producto;
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function eliminarProducto(productoId) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter((producto) => producto.id != productoId);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito(); // Mostrar el carrito al cargar la página
});

