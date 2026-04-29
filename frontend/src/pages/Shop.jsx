import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";

function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  }

  function addToCart(product) {
    const found = cart.find((item) => item.id === product.id);

    if (found) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setCartOpen(true);
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function changeQuantity(id, amount) {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  async function placeOrder() {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!phone || !address) {
      alert("Phone and address are required");
      return;
    }

    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone,
        address,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: Number(item.price)
        }))
      })
    });

    if (!res.ok) {
      alert("Failed to place order");
      return;
    }

    alert("Order placed successfully");

    setCart([]);
    setPhone("");
    setAddress("");
    setCartOpen(false);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Polodieu Shop</h1>
          <p style={styles.muted}>Shop your favorite products.</p>
        </div>

        <button style={styles.cartBadge} onClick={() => setCartOpen(true)}>
          🛒 {cartCount} item{cartCount !== 1 ? "s" : ""}
        </button>
      </header>

      <h2>Products</h2>

      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            {p.image ? (
              <img src={p.image} alt={p.name} style={styles.image} />
            ) : (
              <div style={styles.noImage}>No Image</div>
            )}

            <h3>{p.name}</h3>
            <p style={styles.price}>{Number(p.price).toLocaleString()} FCFA</p>
            <p style={styles.muted}>{p.category || "No category"}</p>
            <p style={styles.muted}>Stock: {p.stock}</p>

            <button style={styles.primaryBtn} onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cartOpen && (
        <div style={styles.overlay}>
          <div style={styles.drawer}>
            <div style={styles.drawerHeader}>
              <h2>Your Cart</h2>

              <button style={styles.closeBtn} onClick={() => setCartOpen(false)}>
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p style={styles.muted}>Your cart is empty.</p>
            ) : (
              <>
                <div style={styles.cartItems}>
                  {cart.map((item) => (
                    <div key={item.id} style={styles.cartItem}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={styles.cartImage} />
                      ) : (
                        <div style={styles.cartNoImage}>No Image</div>
                      )}

                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 6px" }}>{item.name}</h3>

                        <p style={styles.price}>
                          {(Number(item.price) * item.quantity).toLocaleString()} FCFA
                        </p>

                        <div style={styles.qtyRow}>
                          <button style={styles.qtyBtn} onClick={() => changeQuantity(item.id, -1)}>
                            -
                          </button>

                          <b>{item.quantity}</b>

                          <button style={styles.qtyBtn} onClick={() => changeQuantity(item.id, 1)}>
                            +
                          </button>

                          <button
                            style={styles.removeBtn}
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.checkout}>
                  <h2>Total: {total.toLocaleString()} FCFA</h2>

                  <input
                    style={styles.input}
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <input
                    style={styles.input}
                    placeholder="Delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <button style={styles.primaryBtnFull} onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "Arial",
    background: "#f4f6f8",
    color: "#111827"
  },
  header: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
  },
  title: {
    margin: 0,
    fontSize: "32px"
  },
  muted: {
    color: "#6b7280",
    margin: "6px 0"
  },
  cartBadge: {
    background: "#111827",
    color: "white",
    padding: "12px 18px",
    borderRadius: "999px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px"
  },
  card: {
    background: "white",
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
  },
  image: {
    width: "100%",
    height: "170px",
    objectFit: "cover",
    borderRadius: "12px",
    background: "#e5e7eb"
  },
  noImage: {
    height: "170px",
    borderRadius: "12px",
    background: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#6b7280"
  },
  price: {
    color: "#16a34a",
    fontWeight: "bold"
  },
  primaryBtn: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  },
  primaryBtnFull: {
    width: "100%",
    padding: "13px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000
  },
  drawer: {
    width: "100%",
    maxWidth: "430px",
    height: "100vh",
    background: "white",
    padding: "20px",
    boxSizing: "border-box",
    overflowY: "auto",
    boxShadow: "-8px 0 30px rgba(0,0,0,0.2)"
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "16px"
  },
  closeBtn: {
    border: "none",
    background: "#111827",
    color: "white",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer"
  },
  cartItems: {
    display: "grid",
    gap: "12px"
  },
  cartItem: {
    display: "flex",
    gap: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "12px",
    alignItems: "center"
  },
  cartImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "12px",
    background: "#e5e7eb"
  },
  cartNoImage: {
    width: "80px",
    height: "80px",
    borderRadius: "12px",
    background: "#e5e7eb",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px"
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap"
  },
  qtyBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: "bold"
  },
  removeBtn: {
    padding: "8px 10px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer"
  },
  checkout: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    marginBottom: "12px",
    fontSize: "15px",
    boxSizing: "border-box"
  }
};

export default Shop;