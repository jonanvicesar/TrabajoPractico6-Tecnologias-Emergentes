const api = "http://185.218.124.154:8800/api";

const loginForm = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");
const productosContainer = document.getElementById("productos");

async function login(email, password) {
    try {
        const response = await fetch(`${api}/users/users/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error(`HTTP error: ${resp.status}`);

        const datos = await resp.json();
        console.log("login data", data);

        const token = datos.token;

        return token;

    } catch (err) {
        console.log("Error en login", err.message);
        return null;
    }
}

async function getProductos(token) {
    try {
        const resp = await fetch(`${api}/inventory/products/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);

        const data = await resp.json();
        console.log("productos data", data);

        return data;

    } catch (err) {
        console.log("Error al traer productos", err.message);
        return [];
    }
}

function mostrarProductos(productos) {
    productosContainer.innerHTML = "";

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto-card";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.name || producto.nombre || "Sin nombre";

        const precio = document.createElement("p");
        precio.textContent = `Precio: ${producto.price || producto.precio || "N/A"}`;

        card.appendChild(nombre);
        card.appendChild(precio);
        productosContainer.appendChild(card);
    });
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const token = await login(email, password);

    if (!token) {
        mensaje.textContent = "Error al iniciar sesion";
        return;
    }

    localStorage.setItem("token", token);
    mensaje.textContent = "";
    loginForm.classList.add("oculto");

    const productos = await getProductos(token);
    mostrarProductos(productos);
});
window.addEventListener("DOMContentLoaded", async () => {
    const tokenGuardado = localStorage.getItem("token");

    if (tokenGuardado) {
        loginForm.classList.add("oculto");
        const productos = await getProductos(tokenGuardado);
        mostrarProductos(productos);
    }
});