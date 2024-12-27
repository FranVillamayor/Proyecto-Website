let productos = []; // Variable global para los productos

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contacto");
    const JSON_URL = "./productos.json";

    // Validar formulario
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const nombre = document.getElementById("nombre")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const mensaje = document.getElementById("mensaje")?.value.trim();

        if (nombre && email && mensaje) {
            console.log("Todos los campos están completos.");
        } else {
            console.log("Por favor, complete todos los campos del formulario.");
        }
    });

    // Cargar productos
    async function cargarProductos() {
        try {
            const respuesta = await fetch(JSON_URL);
            if (!respuesta.ok) throw new Error(`Error al cargar JSON: ${respuesta.status}`);

            productos = await respuesta.json(); // Almacenar productos globalmente
            mostrarProductos(productos); // Mostrar productos en la página
            mostrarCarrito(); // Mostrar carrito sincronizado
        } catch (error) {
            console.error("Error al cargar productos:", error.message);
            mostrarError("No se pudieron cargar los productos.");
        }
    }

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

        // Agregar eventos a los botones después de generar las tarjetas
        document.querySelectorAll(".agregar-carrito").forEach((boton) => {
            boton.addEventListener("click", (e) => {
                const productoId = e.target.dataset.id;
                agregarAlCarrito(productoId);
            });
        });
    }

    function agregarAlCarrito(productoId) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const productoEnCarrito = carrito.find((p) => p.id == productoId);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            const producto = productos.find((p) => p.id == productoId);
            if (producto) carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito(); // Actualizar carrito visualmente
    }

    function mostrarCarrito() {
        const carritoContainer = document.querySelector(".carrito-container");
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        carritoContainer.innerHTML = carrito.length
            ? carrito.map((producto) => `
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
            `).join("")
            : "<p>El carrito está vacío.</p>";

        // Agregar eventos a los botones
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
        carrito = carrito.map((producto) =>
            producto.id == productoId ? { ...producto, cantidad: Math.max(1, producto.cantidad + cambio) } : producto
        );
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }

    function eliminarProducto(productoId) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.filter((producto) => producto.id != productoId);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }

    cargarProductos(); // Llamar al cargar la página
});

