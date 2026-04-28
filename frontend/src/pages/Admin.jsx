import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";

function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);

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
      localStorage.removeItem("admin_token");
      setAuthorized(false);
      return;
    }

    const data = await res.json();
    setOrders(data);
  }

  function startEdit(product) {
    setEditing({ ...product });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEdit() {
    if (!editing.name || !editing.price || !editing.stock) {
      alert("Name, price, and stock are required");
      return;
    }

    const res = await fetch(`${API_URL}/products/${editing.id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        name: editing.name,
        price: Number(editing.price),
        category: editing.category,
        image: editing.image,
        stock: Number(editing.stock)
      })
    });

    if (!res.ok) {
      alert("Failed to update product");
      return;
    }

    setEditing(null);
    loadProducts();
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

      {editing && (
        <div style={{ border: "2px solid green", padding: 20, marginTop: 20 }}>
          <h2>Edit Product</h2>

          <input
            placeholder="Name"
            value={editing.name || ""}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Price"
            value={editing.price || ""}
            onChange={(e) => setEditing({ ...editing, price: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="Category"
            value={editing.category || ""}
            onChange={(e) => setEditing({ ...editing, category: e.target.value })}
          />
          <br /><br />

          <input
            placeholder="Image URL"
            value={editing.image || ""}
            onChange={(e) => setEditing({ ...editing, image: e.target.value })}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Stock"
            value={editing.stock || ""}
            onChange={(e) => setEditing({ ...editing, stock: e.target.value })}
          />
          <br /><br />

          <button onClick={saveEdit}>Save</button>

          <button
            onClick={() => setEditing(null)}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        </div>
      )}

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

          <button onClick={() => startEdit(p)}>Edit</button>

          <button
            onClick={() => deleteProduct(p.id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>
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