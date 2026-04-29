import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";
const WHATSAPP_NUMBER = "237651325289";

function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  }

  const categories = [
    "ALL",
    ...new Set(products.map((p) => p.category).filter(Boolean))
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "ALL" || p.category === category;

    return matchesSearch && matchesCategory;
  });

  function addToCart(product) {
    if (product.stock <= 0) {
      alert("Out of stock");
      return;
    }

    const found = cart.find((item) => item.id === product.id);

    if (found) {
      if (found.quantity >= product.stock) {
        alert("Cannot add more than available stock");
        return;
      }

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
      cart.map((item) => {
        if (item.id !== id) return item;

        const nextQuantity = item.quantity + amount;

        if (nextQuantity < 1) return item;

        if (nextQuantity > item.stock) {
          alert("Cannot add more than available stock");
          return item;
        }

        return { ...item, quantity: nextQuantity };
      })
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function openWhatsAppOrder(orderId) {
    const itemsText = cart
      .map(
        (item) =>
          `${item.name} x${item.quantity} = ${(
            Number(item.price) * item.quantity
          ).toLocaleString()} FCFA`
      )
      .join("\n");

    const message =
      `New Order\n\n` +
      `Order ID: ${orderId}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n\n` +
      `Items:\n${itemsText}\n\n` +
      `Total: ${total.toLocaleString()} FCFA`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  async function checkPaymentStatus(referenceId, orderId) {
    setPaymentMessage("Checking payment status...");

    for (let i = 0; i < 8; i++) {
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const res = await fetch(
        `${API_URL}/payment/mtn/${referenceId}/status?orderId=${orderId}`
      );

      const data = await res.json();

      if (data.status === "SUCCESSFUL") {
        setPaymentMessage("✅ Payment confirmed. Order paid.");
        setCart([]);
        setPhone("");
        setAddress("");
        setCartOpen(false);
        loadProducts();
        return;
      }

      if (data.status === "FAILED") {
        setPaymentMessage("❌ Payment failed.");
        return;
      }

      setPaymentMessage("Waiting for payment confirmation...");
    }

    setPaymentMessage("Payment request sent. Check admin later.");
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!phone || !address) {
      alert("Phone and address are required");
      return;
    }

    try {
      setLoading(true);
      setPaymentMessage("");

      const orderRes = await fetch(`${API_URL}/orders`, {
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

      if (!orderRes.ok) {
        const error = await orderRes.json();
        alert(error.error || "Failed to create order");
        return;
      }

      const orderData = await orderRes.json();

      const paymentRes = await fetch(`${API_URL}/payment/mtn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: total,
          phone,
          orderId: orderData.id
        })
      });

      if (!paymentRes.ok) {
        const error = await paymentRes.json();
        alert(error.error || "Payment request failed");
        return;
      }

      const paymentData = await paymentRes.json();

      setPaymentMessage("📱 Payment request sent. Check your phone.");
      openWhatsAppOrder(orderData.id);

      await checkPaymentStatus(paymentData.referenceId, orderData.id);
    } catch (error) {
      console.log(error);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  }

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

      <div style={styles.filterCard}>
        <input
          style={styles.input}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "ALL" ? "All categories" : cat}
            </option>
          ))}
        </select>
      </div>

      <h2>Products</h2>

      {filteredProducts.length === 0 ? (
        <p style={styles.muted}>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((p) => (
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

              <button
                style={{
                  ...styles.primaryBtn,
                  opacity: p.stock <= 0 ? 0.5 : 1,
                  cursor: p.stock <= 0 ? "not-allowed" : "pointer"
                }}
                disabled={p.stock <= 0}
                onClick={() => addToCart(p)}
              >
                {p.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}

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

                        <p style={styles.muted}>Available: {item.stock}</p>

                        <div style={styles.qtyRow}>
                          <button style={styles.qtyBtn} onClick={() => changeQuantity(item.id, -1)}>
                            -
                          </button>

                          <b>{item.quantity}</b>

                          <button style={styles.qtyBtn} onClick={() => changeQuantity(item.id, 1)}>
                            +
                          </button>

                          <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
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
                    placeholder="MTN phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />

                  <input
                    style={styles.input}
                    placeholder="Delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                  />

                  {paymentMessage && (
                    <p style={styles.paymentMessage}>{paymentMessage}</p>
                  )}

                  <button
                    style={{
                      ...styles.primaryBtnFull,
                      opacity: loading ? 0.6 : 1
                    }}
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Processing payment..." : "Pay with MTN MoMo"}
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
  filterCard: {
    background: "white",
    padding: "16px",
    borderRadius: "16px",
    marginBottom: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
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
  },
  paymentMessage: {
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "12px"
  }
};

export default Shop;