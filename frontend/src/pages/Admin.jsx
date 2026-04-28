import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });

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

  async function login(password) {
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
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      alert("Failed to load products");
    }
  }

  async function loadOrders() {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: localStorage.getItem("admin_token")
        }
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setOrders(data);
    } catch {
      alert("Failed to load orders");
    }
  }

  async function uploadImage(file, mode = "new") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "polodieu_upload");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhaq7puzh/image/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        alert("Image upload failed");
        return;
      }

      if (mode === "edit") {
        setEditing(prev => ({ ...prev, image: data.secure_url }));
      } else {
        setNewProduct(prev => ({ ...prev, image: data.secure_url }));
      }

      alert("Image uploaded");
    } catch {
      alert("Image upload failed");
    }
  }

  async function createProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Name, price, and stock are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock)
        })
      });

      if (!res.ok) throw new Error();

      alert("Product added");

      setNewProduct({
        name: "",
        price: "",
        category: "",
        image: "",
        stock: ""
      });

      loadProducts();
    } catch {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  function editProduct(product) {
    setEditing(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct() {
    if (!editing.name || !editing.price || !editing.stock) {
      alert("Name, price, and stock are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/products/${editing.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...editing,
          price: Number(editing.price),
          stock: Number(editing.stock)
        })
      });

      if (!res.ok) throw new Error();

      alert("Product updated");
      setEditing(null);
      loadProducts();
    } catch {
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("admin_token")
        }
      });

      if (!res.ok) throw new Error();

      alert("Product deleted");
      loadProducts();
    } catch {
      alert("Failed to delete product");
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error();

      loadOrders();
    } catch {
      alert("Failed to update order status");
    }
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  if (!authorized) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        background: "#f5f6f8"
      }}>
        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          width: "300px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h2>Admin Login</h2>

          <input
            type="password"
            placeholder="Enter admin password"
            style={{ width: "100%", padding: "10px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login(e.target.value);
              }
            }}
          />

          <p style={{ fontSize: "13px", color: "gray" }}>
            Press Enter to login
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      background: "#f5f6f8",
      minHeight: "100vh"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1>Admin Panel</h1>

        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            setAuthorized(false);
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
        marginBottom: "20px"
      }}>
        <div style={statBox}>
          <h3>{products.length}</h3>
          <p>Products</p>
        </div>

        <div style={statBox}>
          <h3>{orders.length}</h3>
          <p>Orders</p>
        </div>

        <div style={statBox}>
          <h3>{totalRevenue.toLocaleString()} FCFA</h3>
          <p>Revenue</p>
        </div>
      </div>

      <div style={cardGreen}>
        <h2>Add Product</h2>

        <input style={inputStyle} placeholder="Name" value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        />

        <input style={inputStyle} placeholder="Price" type="number" value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
        />

        <input style={inputStyle} placeholder="Category" value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
        />

        <input
          style={inputStyle}
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (file) uploadImage(file);
          }}
        />

        {newProduct.image && (
          <img src={newProduct.image} alt="Preview" style={imageStyle} />
        )}

        <input style={inputStyle} placeholder="Image URL" value={newProduct.image}
          onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
        />

        <input style={inputStyle} placeholder="Stock" type="number" value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
        />

        <button onClick={createProduct} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {editing && (
        <div style={cardBlack}>
          <h2>Edit Product</h2>

          <input style={inputStyle} placeholder="Name" value={editing.name}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
          />

          <input style={inputStyle} placeholder="Price" type="number" value={editing.price}
            onChange={e => setEditing({ ...editing, price: e.target.value })}
          />

          <input style={inputStyle} placeholder="Category" value={editing.category || ""}
            onChange={e => setEditing({ ...editing, category: e.target.value })}
          />

          <input
            style={inputStyle}
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files[0];
              if (file) uploadImage(file, "edit");
            }}
          />

          {editing.image && (
            <img src={editing.image} alt="Preview" style={imageStyle} />
          )}

          <input style={inputStyle} placeholder="Image URL" value={editing.image || ""}
            onChange={e => setEditing({ ...editing, image: e.target.value })}
          />

          <input style={inputStyle} placeholder="Stock" type="number" value={editing.stock}
            onChange={e => setEditing({ ...editing, stock: e.target.value })}
          />

          <button onClick={saveProduct} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          <button onClick={() => setEditing(null)} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      )}

      <h2>Products</h2>

      {products.map(p => (
        <div key={p.id} style={card}>
          <p><b>{p.name}</b></p>

          {p.image && (
            <img src={p.image} alt={p.name} style={imageStyle} />
          )}

          <p style={{ color: "green", fontWeight: "bold" }}>
            {Number(p.price).toLocaleString()} FCFA
          </p>

          <p>Category: {p.category}</p>
          <p>Stock: {p.stock}</p>

          <button onClick={() => deleteProduct(p.id)}>Delete</button>

          <button onClick={() => editProduct(p)} style={{ marginLeft: "10px" }}>
            Edit
          </button>
        </div>
      ))}

      <h2>Orders</h2>

      {orders.map(order => (
        <div key={order.id} style={card}>
          <h3>Order #{order.id}</h3>

          <p><b>Status:</b></p>

          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
            style={inputStyle}
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <p><b>Total:</b> {Number(order.total).toLocaleString()} FCFA</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Address:</b> {order.address}</p>

          <h4>Items</h4>

          {order.items?.map(item => (
            <div key={item.id}>
              <p>
                {item.product?.name || "Product"} — x{item.quantity} —{" "}
                {Number(item.price * item.quantity).toLocaleString()} FCFA
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  maxWidth: "400px",
  padding: "10px",
  marginBottom: "12px"
};

const card = {
  background: "white",
  border: "1px solid #ccc",
  padding: "15px",
  marginBottom: "12px",
  borderRadius: "10px"
};

const cardGreen = {
  ...card,
  border: "2px solid green"
};

const cardBlack = {
  ...card,
  border: "2px solid black"
};

const imageStyle = {
  width: "120px",
  borderRadius: "8px",
  display: "block",
  marginBottom: "10px"
};

const statBox = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "160px",
  border: "1px solid #ddd"
};

export default Admin;