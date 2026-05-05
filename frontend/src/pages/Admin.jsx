import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000";

function Admin() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      alert("Failed to load products");
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPrice = price.toString().trim();
    const cleanStock = stock.toString().trim();

    if (!cleanName || !cleanPrice || !cleanStock) {
      alert("Name, price and stock are required");
      return;
    }

    if (images.length === 0) {
      alert("Please select at least one product image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", cleanName);
      formData.append("price", cleanPrice);
      formData.append("stock", cleanStock);
      formData.append("category", category.trim() || "General");
      formData.append("description", description.trim());

      const orderedImages = [
        images[mainIndex],
        ...images.filter((_, index) => index !== mainIndex),
      ];

      orderedImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: "secure-admin-token",
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to add product");
        return;
      }

      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      setImages([]);
      setMainIndex(0);
      setDescription("");

      await loadProducts();
      alert("Product added successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
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
          Authorization: "secure-admin-token",
        },
      });

      if (!res.ok) {
        alert("Failed to delete product");
        return;
      }

      await loadProducts();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  }

  function getProductImage(product) {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") return firstImage;
      if (firstImage.url) return firstImage.url;
    }

    return product.image || null;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>POLODIEU Admin</h1>
        <p style={styles.muted}>Add and manage shop products</p>
      </header>

      <section style={styles.card}>
        <h2>Add Product</h2>

        <form onSubmit={handleAddProduct} style={styles.formGrid}>
          <input
            style={styles.input}
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Price in FCFA"
            value={price}
            inputMode="numeric"
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Stock quantity"
            value={stock}
            inputMode="numeric"
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Category e.g. Smart TVs"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            multiple
            style={styles.input}
            onChange={(e) => {
              setImages(Array.from(e.target.files || []));
              setMainIndex(0);
            }}
          />

          <textarea
            style={{ ...styles.input, minHeight: "110px" }}
            placeholder="Product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {images.length > 0 && (
            <div style={styles.previewBox}>
              {images.map((file, index) => (
                <div
                  key={index}
                  onClick={() => setMainIndex(index)}
                  style={{
                    ...styles.previewItem,
                    border:
                      mainIndex === index
                        ? "3px solid #f97316"
                        : "1px solid #e5e7eb",
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    style={styles.previewImage}
                  />

                  {mainIndex === index && (
                    <span style={styles.mainBadge}>Main</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <button type="submit" style={styles.addBtn} disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </section>

      <section style={styles.card}>
        <h2>Products</h2>

        {products.length === 0 ? (
          <p style={styles.muted}>No products yet.</p>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => {
              const productImage = getProductImage(p);

              return (
                <div key={p.id} style={styles.productCard}>
                  {productImage ? (
                    <img src={productImage} alt={p.name} style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}

                  <h3>{p.name}</h3>

                  <p style={styles.price}>
                    {Number(p.price).toLocaleString()} FCFA
                  </p>

                  <p style={styles.muted}>Category: {p.category || "General"}</p>
                  <p style={styles.muted}>Stock: {p.stock}</p>
                  <p style={styles.muted}>{p.description || "No description"}</p>

                  {Array.isArray(p.images) && p.images.length > 1 && (
                    <div style={styles.thumbnailRow}>
                      {p.images.map((img, index) => {
                        const imgUrl = typeof img === "string" ? img : img.url;

                        return (
                          <img
                            key={index}
                            src={imgUrl}
                            alt={p.name}
                            style={styles.thumbnail}
                          />
                        );
                      })}
                    </div>
                  )}

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },
  header: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  title: {
    margin: 0,
    color: "#f97316",
  },
  muted: {
    color: "#6b7280",
    margin: "6px 0",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  previewBox: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  previewItem: {
    borderRadius: "10px",
    padding: "3px",
    cursor: "pointer",
    position: "relative",
  },
  previewImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px",
    display: "block",
  },
  mainBadge: {
    position: "absolute",
    bottom: "6px",
    left: "6px",
    background: "#f97316",
    color: "white",
    fontSize: "11px",
    fontWeight: "900",
    padding: "3px 6px",
    borderRadius: "999px",
  },
  addBtn: {
    background: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontWeight: "900",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  productCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
    background: "#fff",
  },
  image: {
    width: "100%",
    height: "170px",
    objectFit: "cover",
    borderRadius: "12px",
    background: "#e5e7eb",
  },
  noImage: {
    height: "170px",
    borderRadius: "12px",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },
  thumbnailRow: {
    display: "flex",
    gap: "6px",
    margin: "10px 0",
    overflowX: "auto",
  },
  thumbnail: {
    width: "45px",
    height: "45px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  },
  price: {
    fontWeight: "900",
    color: "#111827",
  },
  deleteBtn: {
    width: "100%",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "11px",
    fontWeight: "900",
    cursor: "pointer",
  },
};

export default Admin;