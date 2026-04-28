import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  function getAuthHeaders() {
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
      alert("Wrong password");
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
      alert("Unauthorized - login again");
      setAuthorized(false);
      return;
    }

    const data = await res.json();
    setOrders(data);
  }

  async function deleteProduct(id) {
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
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    loadOrders();
  }

  if (!authorized) {
    return (
      <div style={{ padding: 50 }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
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

      {products.map(p => (
        <div key={p.id}>
          <b>{p.name}</b> - {p.price} FCFA
          <button onClick={() => deleteProduct(p.id)}>Delete</button>
        </div>
      ))}

      <h2>Orders</h2>

      {orders.map(order => (
        <div key={order.id}>
          <p>Order #{order.id} - {order.status}</p>

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