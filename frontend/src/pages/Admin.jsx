import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";

function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("admin_token")
    };
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) setAuthorized(true);
  }, []);

  useEffect(() => {
    if (authorized) {
      loadProducts();
      loadOrders();
    }
  }, [authorized]);

  async function login() {
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      setAuthorized(true);
    } catch {
      alert("Admin login failed");
    }
  }

  async function loadProducts() {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  }

  async function loadOrders() {
    const res = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: localStorage.getItem("admin_token")
      }
    });

    if (!res.ok) {
      alert("Unauthorized. Please login again.");
      localStorage.removeItem("admin_token");
      setAuthorized(false);
      return;
    }

    const data = await res.json();
    setOrders(data);
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("admin_token")
      }
    });

    loadProducts();
  }

  async function updateOrderStatus(id, status) {
    await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });

    loadOrders();
  }

  if (!authorized) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Admin Login</h1>

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") login();
          }}
        />

        <br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Admin Panel</h1>

      <button
        onClick={() => {
          localStorage.removeItem("admin_token");
          setAuthorized(false);
        }}
      >
        Logout
      </button>

      <h2>Products</h2>

      {products.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
          <h3>{p.name}</h3>

          {p.image && (
            <img
              src={p.image}
              alt={p.name}
              style={{ width: 120, borderRadius: 8 }}
            />
          )}

          <p>{Number(p.price).toLocaleString()} FCFA</p>
          <p>Category: {p.category}</p>
          <p>Stock: {p.stock}</p>

          <button onClick={() => deleteProduct(p.id)}>Delete</button>
        </div>
      ))}

      <h2>Orders</h2>

      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
          <h3>Order #{order.id}</h3>

          <p>Total: {Number(order.total).toLocaleString()} FCFA</p>
          <p>Phone: {order.phone}</p>
          <p>Address: {order.address}</p>

          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default Admin;