let productos = []; // Variable global para los productos

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contacto");
    const JSON_URL = "./productos.json";
    const abrirCarritoBtn = document.getElementById("abrir-carrito");
    const modalCarrito = document.getElementById("modal-carrito");
    const cerrarModalBtn = document.getElementById("cerrar-modal");
    const cantidadCarrito = document.getElementById("cantidad-carrito");

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

    // Cargar productos desde el JSON
    async function cargarProductos() {
        try {
            const respuesta = await fetch(JSON_URL);
            if (!respuesta.ok) throw new Error(`Error al cargar JSON: ${respuesta.status}`);

            productos = await respuesta.json();
            mostrarProductos(productos);
        } catch (error) {
            console.error("Error al cargar productos:", error.message);
        }
    }

    // Mostrar productos en la página
    function mostrarProductos(productos) {
        const contenedor = document.querySelector(".productos-container");
        if (!contenedor) {
            console.error("El contenedor de productos no existe.");
            return;
        }

        contenedor.innerHTML = productos
            .map(
                (producto) => `
                <div class="producto-card">
                    <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" width="300" height="200">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p><strong>Precio:</strong> $${producto.precio}</p>
                    <button class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
                </div>
            `
            )
            .join("");

        // Agregar eventos a los botones
        document.querySelectorAll(".agregar-carrito").forEach((boton) =>
            boton.addEventListener("click", (e) => agregarAlCarrito(e.target.dataset.id))
        );
    }

    // Agregar producto al carrito
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
        actualizarCantidadCarrito();
    }

    // Mostrar el carrito dentro del modal
    function mostrarCarrito() {
        const carritoContainer = document.querySelector(".carrito-container");
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
        carritoContainer.innerHTML = carrito.length
            ? carrito.map((producto) => `
                <div class="carrito-item">
                    <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" width="50" height="50" style="border-radius: 5px;">
                    <div>
                        <h3>${producto.nombre}</h3>
                        <p>Precio: $${producto.precio}</p>
                        <p>Cantidad: 
                            <button class="decrementar" data-id="${producto.id}">-</button>
                            ${producto.cantidad}
                            <button class="incrementar" data-id="${producto.id}">+</button>
                        </p>
                        <button class="eliminar" data-id="${producto.id}">Eliminar</button>
                    </div>
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

    // Editar la cantidad de un producto en el carrito
    function editarCantidad(productoId, cambio) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.map((producto) =>
            producto.id == productoId ? { ...producto, cantidad: Math.max(1, producto.cantidad + cambio) } : producto
        );
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarCantidadCarrito();
    }

    // Eliminar producto del carrito
    function eliminarProducto(productoId) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.filter((producto) => producto.id != productoId);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarCantidadCarrito();
    }

    // Actualizar contador del carrito
    function actualizarCantidadCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalCantidad = carrito.reduce((sum, producto) => sum + producto.cantidad, 0);
        cantidadCarrito.textContent = `(${totalCantidad})`;
    }

    // Control del modal
    abrirCarritoBtn.addEventListener("click", () => {
        mostrarCarrito();
        modalCarrito.style.display = "block";
    });

    cerrarModalBtn.addEventListener("click", () => {
        modalCarrito.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target == modalCarrito) {
            modalCarrito.style.display = "none";
        }
    });

    // Cargar productos al inicio
    cargarProductos();
    actualizarCantidadCarrito(); // Actualizar contador inicial
});
