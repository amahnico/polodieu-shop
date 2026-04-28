import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  async function loadProducts() {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  }

  async function loadOrders() {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();
    setOrders(data);
  }

  async function uploadImage(file) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "polodieu_upload");

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

    setNewProduct({
      ...newProduct,
      image: data.secure_url
    });

    alert("Image uploaded");
  }

  async function createProduct() {
    await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      })
    });

    alert("Product added");

    setNewProduct({
      name: "",
      price: "",
      category: "",
      image: "",
      stock: ""
    });

    loadProducts();
  }

  function editProduct(product) {
    setEditing(product);
  }

  async function saveProduct() {
    await fetch(`${API_URL}/products/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing)
    });

    alert("Product updated");
    setEditing(null);
    loadProducts();
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE"
    });

    alert("Product deleted");
    loadProducts();
  }

  async function markAsPaid(id) {
    await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAID" })
    });

    loadOrders();
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Admin Panel</h1>

      <div style={{
        border: "2px solid green",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "10px"
      }}>
        <h2>Add Product</h2>

        <input
          placeholder="Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        /><br /><br />

        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
        /><br /><br />

        <input
          placeholder="Category"
          value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
        /><br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (file) uploadImage(file);
          }}
        /><br /><br />

        {newProduct.image && (
          <>
            <img
              src={newProduct.image}
              alt="Preview"
              style={{ width: "150px", borderRadius: "8px" }}
            />
            <br /><br />
          </>
        )}

        <input
          placeholder="Image URL"
          value={newProduct.image}
          onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
        /><br /><br />

        <input
          placeholder="Stock"
          type="number"
          value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
        /><br /><br />

        <button onClick={createProduct}>
          Add Product
        </button>
      </div>

      {editing && (
        <div style={{
          border: "2px solid black",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "10px"
        }}>
          <h2>Edit Product</h2>

          <input
            placeholder="Name"
            value={editing.name}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
          /><br /><br />

          <input
            placeholder="Price"
            type="number"
            value={editing.price}
            onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
          /><br /><br />

          <button onClick={saveProduct}>Save</button>

          <button onClick={() => setEditing(null)} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      )}

      <h2>Products</h2>

      {products.map(p => (
        <div key={p.id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px"
        }}>
          <p><b>{p.name}</b></p>

          {p.image && (
            <img
              src={p.image}
              alt={p.name}
              style={{ width: "120px", borderRadius: "8px" }}
            />
          )}

          <p style={{ color: "green", fontWeight: "bold" }}>
            {p.price.toLocaleString()} FCFA
          </p>

          <p>Category: {p.category}</p>
          <p>Stock: {p.stock}</p>

          <button onClick={() => deleteProduct(p.id)}>
            Delete
          </button>

          <button onClick={() => editProduct(p)} style={{ marginLeft: "10px" }}>
            Edit
          </button>
        </div>
      ))}

      <h2>Orders</h2>

      {orders.map(order => (
        <div key={order.id} style={{
          border: "1px solid #ddd",
          marginBottom: "10px",
          padding: "10px",
          borderRadius: "8px"
        }}>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Total:</b> {order.total.toLocaleString()} FCFA</p>
          <p><b>Status:</b> {order.status}</p>

          {order.status === "PENDING" && (
            <button onClick={() => markAsPaid(order.id)}>
              Mark as Paid
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Admin;