import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dhaq7puzh/image/upload";
const CLOUDINARY_PRESET = "polodieu_upload";

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  image: "",
  stock: ""
};

function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);

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
      headers: { Authorization: localStorage.getItem("admin_token") }
    });

    if (!res.ok) {
      localStorage.removeItem("admin_token");
      setAuthorized(false);
      return;
    }

    const data = await res.json();
    setOrders(data);
  }

  async function uploadImage(file, type) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      setUploading(true);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!data.secure_url) {
        alert("Image upload failed");
        return;
      }

      if (type === "new") {
        setNewProduct((prev) => ({ ...prev, image: data.secure_url }));
      }

      if (type === "edit") {
        setEditing((prev) => ({ ...prev, image: data.secure_url }));
      }

      alert("Image uploaded");
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function addProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Name, price, and stock are required");
      return;
    }

    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
        image: newProduct.image,
        stock: Number(newProduct.stock)
      })
    });

    if (!res.ok) {
      alert("Failed to add product");
      return;
    }

    setNewProduct(emptyProduct);
    loadProducts();
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
      headers: { Authorization: localStorage.getItem("admin_token") }
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

  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  if (!authorized) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.muted}>Enter your admin password.</p>

          <input
            style={styles.input}
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          />

          <button style={styles.primaryBtn} onClick={login}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.muted}>Manage your shop.</p>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem("admin_token");
            setAuthorized(false);
          }}
        >
          Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}><h2>{products.length}</h2><p>Products</p></div>
        <div style={styles.statCard}><h2>{orders.length}</h2><p>Orders</p></div>
        <div style={styles.statCard}><h2>{revenue.toLocaleString()} FCFA</h2><p>Revenue</p></div>
      </div>

      <div style={styles.editCard}>
        <h2>Add Product</h2>

        <div style={styles.formGrid}>
          <input style={styles.input} placeholder="Name" value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

          <input style={styles.input} type="number" placeholder="Price" value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />

          <input style={styles.input} placeholder="Category" value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />

          <input style={styles.input} type="number" placeholder="Stock" value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />

          <input
            style={styles.input}
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0], "new")}
          />

          <input style={styles.input} placeholder="Image URL" value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
        </div>

        {uploading && <p style={styles.muted}>Uploading image...</p>}

        {newProduct.image && (
          <img src={newProduct.image} alt="Preview" style={styles.previewImage} />
        )}

        <button style={styles.primaryBtn} onClick={addProduct} disabled={uploading}>
          Add Product
        </button>
      </div>

      {editing && (
        <div style={styles.editCard}>
          <h2>Edit Product</h2>

          <div style={styles.formGrid}>
            <input style={styles.input} placeholder="Name" value={editing.name || ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })} />

            <input style={styles.input} type="number" placeholder="Price" value={editing.price || ""}
              onChange={(e) => setEditing({ ...editing, price: e.target.value })} />

            <input style={styles.input} placeholder="Category" value={editing.category || ""}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })} />

            <input style={styles.input} type="number" placeholder="Stock" value={editing.stock || ""}
              onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />

            <input
              style={styles.input}
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage(e.target.files[0], "edit")}
            />

            <input style={styles.input} placeholder="Image URL" value={editing.image || ""}
              onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
          </div>

          {uploading && <p style={styles.muted}>Uploading image...</p>}

          {editing.image && (
            <img src={editing.image} alt="Preview" style={styles.previewImage} />
          )}

          <div style={styles.actions}>
            <button style={styles.primaryBtn} onClick={saveEdit} disabled={uploading}>
              Save Changes
            </button>
            <button style={styles.grayBtn} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <h2 style={styles.sectionTitle}>Products</h2>

      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            {p.image ? (
              <img src={p.image} alt={p.name} style={styles.productImage} />
            ) : (
              <div style={styles.noImage}>No Image</div>
            )}

            <h3>{p.name}</h3>
            <p style={styles.price}>{Number(p.price).toLocaleString()} FCFA</p>
            <p style={styles.muted}>Category: {p.category || "None"}</p>
            <p style={styles.muted}>Stock: {p.stock}</p>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => startEdit(p)}>Edit</button>
              <button style={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={styles.sectionTitle}>Orders</h2>

      <div style={styles.orderList}>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <div>
              <h3>Order #{order.id}</h3>
              <p style={styles.muted}>Phone: {order.phone || "N/A"}</p>
              <p style={styles.muted}>Address: {order.address || "N/A"}</p>
              <p style={styles.price}>{Number(order.total).toLocaleString()} FCFA</p>
            </div>

            <select
              style={styles.select}
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
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px", fontFamily: "Arial", background: "#f4f6f8", color: "#111827" },
  loginPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial", background: "#f4f6f8" },
  loginCard: { width: "100%", maxWidth: "360px", background: "white", padding: "28px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { margin: 0, fontSize: "30px" },
  muted: { color: "#6b7280", margin: "6px 0" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" },
  statCard: { background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" },
  editCard: { background: "white", padding: "20px", borderRadius: "16px", marginBottom: "24px", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "14px" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "15px", width: "100%", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" },
  card: { background: "white", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" },
  productImage: { width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", background: "#e5e7eb" },
  noImage: { height: "160px", borderRadius: "12px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" },
  previewImage: { width: "160px", borderRadius: "12px", marginBottom: "14px", display: "block" },
  price: { color: "#16a34a", fontWeight: "bold" },
  actions: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" },
  primaryBtn: { padding: "11px 16px", border: "none", borderRadius: "10px", background: "#16a34a", color: "white", cursor: "pointer", fontWeight: "bold" },
  editBtn: { padding: "10px 14px", border: "none", borderRadius: "10px", background: "#2563eb", color: "white", cursor: "pointer" },
  deleteBtn: { padding: "10px 14px", border: "none", borderRadius: "10px", background: "#dc2626", color: "white", cursor: "pointer" },
  grayBtn: { padding: "11px 16px", border: "none", borderRadius: "10px", background: "#6b7280", color: "white", cursor: "pointer" },
  logoutBtn: { padding: "10px 14px", border: "none", borderRadius: "10px", background: "#111827", color: "white", cursor: "pointer" },
  sectionTitle: { marginTop: "28px" },
  orderList: { display: "grid", gap: "14px" },
  orderCard: { background: "white", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "center", flexWrap: "wrap" },
  select: { padding: "10px", borderRadius: "10px", border: "1px solid #d1d5db" }
};

export default Admin;