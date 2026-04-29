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
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "ALL" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  function addToCart(product) {
    if (product.stock <= 0) return alert("Out of stock");

    const found = cart.find((item) => item.id === product.id);

    if (found) {
      if (found.quantity >= product.stock) {
        return alert("Cannot add more than available stock");
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
    if (cart.length === 0) return alert("Cart is empty");
    if (!phone || !address) return alert("Phone and address are required");

    try {
      setLoading(true);
      setPaymentMessage("");

      const orderRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
      <header style={styles.nav}>
        <div>
          <h1 style={styles.logo}>POLODIEU</h1>
          <p style={styles.navText}>
            Smart shopping. Fast delivery. Easy MoMo payment.
          </p>
        </div>

        <button style={styles.cartButton} onClick={() => setCartOpen(true)}>
          🛒 Cart <span style={styles.cartPill}>{cartCount}</span>
        </button>
      </header>

      <section style={styles.hero}>
        <div>
          <span style={styles.badge}>Cameroon Online Store</span>

          <h2 style={styles.heroTitle}>
            Quality products delivered with trust.
          </h2>

          <p style={styles.heroText}>
            Shop carefully selected products, pay securely with MTN MoMo,
            and confirm your order instantly through WhatsApp.
          </p>

          <button
            style={styles.heroButton}
            onClick={() => window.scrollTo({ top: 420, behavior: "smooth" })}
          >
            Shop Now
          </button>

          <p style={styles.trustText}>
            Secure checkout • WhatsApp confirmation • Fast local delivery
          </p>
        </div>

        <div style={styles.heroCard}>
          <h3 style={{ marginTop: 0 }}>Trusted by local shoppers</h3>
          <p style={styles.muted}>
            Fast, secure, and simple checkout experience
          </p>

          <div style={styles.statRow}>
            <div>
              <b>{products.length}</b>
              <span>Products</span>
            </div>
            <div>
              <b>{categories.length - 1}</b>
              <span>Categories</span>
            </div>
            <div>
              <b>{cartCount}</b>
              <span>In cart</span>
            </div>
          </div>
        </div>
      </section>

      <main style={styles.main}>
        <section style={styles.toolbar}>
          <div>
            <h2 style={styles.sectionTitle}>Shop Our Collection</h2>
            <p style={styles.muted}>
              Browse our available products and order instantly.
            </p>
          </div>

          <div style={styles.filters}>
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
        </section>

        {filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <h3>No products available right now</h3>
            <p style={styles.muted}>
              Please check back later or explore other categories.
            </p>
          </div>
        ) : (
          <section style={styles.grid}>
            {filteredProducts.map((p) => (
              <article key={p.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}

                  {p.stock <= 0 && (
                    <span style={styles.stockBadge}>Sold out</span>
                  )}
                </div>

                <div style={styles.cardBody}>
                  <p style={styles.category}>{p.category || "General"}</p>
                  <h3 style={styles.productName}>{p.name}</h3>

                  <div style={styles.productFooter}>
                    <div>
                      <p style={styles.price}>
                        {Number(p.price).toLocaleString()} FCFA
                      </p>
                      <p style={styles.stock}>Stock: {p.stock}</p>
                    </div>

                    <button
                      style={{
                        ...styles.addButton,
                        opacity: p.stock <= 0 ? 0.45 : 1,
                        cursor: p.stock <= 0 ? "not-allowed" : "pointer"
                      }}
                      disabled={p.stock <= 0}
                      onClick={() => addToCart(p)}
                    >
                      {p.stock <= 0 ? "Unavailable" : "Add"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {cartOpen && (
        <div style={styles.overlay}>
          <aside style={styles.drawer}>
            <div style={styles.drawerHeader}>
              <div>
                <h2 style={{ margin: 0 }}>Your Shopping Cart</h2>
                <p style={styles.muted}>
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </p>
              </div>

              <button style={styles.closeBtn} onClick={() => setCartOpen(false)}>
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={styles.emptyCart}>
                <h3>Your cart is empty</h3>
                <p style={styles.muted}>Add products to continue.</p>
              </div>
            ) : (
              <>
                <div style={styles.cartItems}>
                  {cart.map((item) => (
                    <div key={item.id} style={styles.cartItem}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={styles.cartImage}
                        />
                      ) : (
                        <div style={styles.cartNoImage}>No Image</div>
                      )}

                      <div style={{ flex: 1 }}>
                        <h3 style={styles.cartName}>{item.name}</h3>
                        <p style={styles.price}>
                          {(Number(item.price) * item.quantity).toLocaleString()} FCFA
                        </p>
                        <p style={styles.stock}>Available: {item.stock}</p>

                        <div style={styles.qtyRow}>
                          <button
                            style={styles.qtyBtn}
                            onClick={() => changeQuantity(item.id, -1)}
                          >
                            −
                          </button>

                          <b>{item.quantity}</b>

                          <button
                            style={styles.qtyBtn}
                            onClick={() => changeQuantity(item.id, 1)}
                          >
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
                  <div style={styles.totalBox}>
                    <span>Total</span>
                    <b>{total.toLocaleString()} FCFA</b>
                  </div>

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
                      ...styles.payButton,
                      opacity: loading ? 0.65 : 1
                    }}
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Processing payment..." : "Complete Payment"}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
    color: "#111827",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "20px"
  },
  nav: {
    maxWidth: "1180px",
    margin: "0 auto 22px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    border: "1px solid #e5e7eb",
    borderRadius: "22px",
    padding: "18px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    boxShadow: "0 12px 30px rgba(15,23,42,0.06)"
  },
  logo: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "950",
    letterSpacing: "-0.05em"
  },
  navText: {
    margin: "5px 0 0",
    color: "#64748b"
  },
  cartButton: {
    border: "none",
    background: "#111827",
    color: "white",
    padding: "12px 16px",
    borderRadius: "999px",
    fontWeight: "900",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  cartPill: {
    background: "#22c55e",
    color: "#052e16",
    minWidth: "24px",
    height: "24px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  hero: {
    maxWidth: "1180px",
    margin: "0 auto 26px",
    background:
      "linear-gradient(135deg, #111827 0%, #1f2937 55%, #15803d 100%)",
    color: "white",
    borderRadius: "30px",
    padding: "42px",
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: "24px",
    boxShadow: "0 24px 60px rgba(15,23,42,0.18)"
  },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "800"
  },
  heroTitle: {
    fontSize: "clamp(34px, 5vw, 58px)",
    lineHeight: 1,
    margin: "18px 0",
    letterSpacing: "-0.06em"
  },
  heroText: {
    color: "#d1d5db",
    maxWidth: "620px",
    fontSize: "17px",
    lineHeight: 1.6
  },
  heroButton: {
    marginTop: "14px",
    border: "none",
    background: "white",
    color: "#111827",
    padding: "14px 22px",
    borderRadius: "999px",
    fontWeight: "950",
    cursor: "pointer"
  },
  trustText: {
    marginTop: "12px",
    color: "#d1d5db",
    fontSize: "14px",
    fontWeight: "500"
  },
  heroCard: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "24px",
    padding: "22px",
    alignSelf: "end"
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginTop: "22px"
  },
  main: {
    maxWidth: "1180px",
    margin: "0 auto"
  },
  toolbar: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },
  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    letterSpacing: "-0.04em"
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "minmax(200px, 280px) minmax(160px, 220px)",
    gap: "10px"
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    background: "white",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px"
  },
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 28px rgba(15,23,42,0.07)"
  },
  imageWrap: {
    position: "relative",
    background: "#f1f5f9"
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block"
  },
  noImage: {
    height: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b"
  },
  stockBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#dc2626",
    color: "white",
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800"
  },
  cardBody: {
    padding: "16px"
  },
  category: {
    margin: 0,
    color: "#16a34a",
    fontSize: "13px",
    fontWeight: "900",
    textTransform: "uppercase"
  },
  productName: {
    margin: "8px 0 16px",
    fontSize: "19px"
  },
  productFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "12px"
  },
  price: {
    color: "#111827",
    fontWeight: "950",
    margin: "0 0 4px"
  },
  stock: {
    color: "#64748b",
    margin: 0,
    fontSize: "13px"
  },
  addButton: {
    border: "none",
    background: "#111827",
    color: "white",
    borderRadius: "14px",
    padding: "11px 15px",
    fontWeight: "900",
    cursor: "pointer"
  },
  muted: {
    color: "#64748b",
    margin: "6px 0"
  },
  emptyState: {
    background: "white",
    border: "1px dashed #cbd5e1",
    borderRadius: "24px",
    padding: "36px",
    textAlign: "center"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.52)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000
  },
  drawer: {
    width: "100%",
    maxWidth: "460px",
    height: "100vh",
    background: "#ffffff",
    padding: "22px",
    boxSizing: "border-box",
    overflowY: "auto",
    boxShadow: "-18px 0 50px rgba(15,23,42,0.25)"
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "14px",
    marginBottom: "16px"
  },
  closeBtn: {
    border: "none",
    background: "#f1f5f9",
    color: "#111827",
    borderRadius: "12px",
    padding: "9px 12px",
    cursor: "pointer",
    fontWeight: "900"
  },
  emptyCart: {
    textAlign: "center",
    padding: "50px 0"
  },
  cartItems: {
    display: "grid",
    gap: "12px"
  },
  cartItem: {
    display: "flex",
    gap: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "12px",
    alignItems: "center",
    background: "#f8fafc"
  },
  cartImage: {
    width: "82px",
    height: "82px",
    objectFit: "cover",
    borderRadius: "16px",
    background: "#e5e7eb"
  },
  cartNoImage: {
    width: "82px",
    height: "82px",
    borderRadius: "16px",
    background: "#e5e7eb",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px"
  },
  cartName: {
    margin: "0 0 6px",
    fontSize: "16px"
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px"
  },
  qtyBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: "900"
  },
  removeBtn: {
    padding: "8px 10px",
    border: "none",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#991b1b",
    cursor: "pointer",
    fontWeight: "800"
  },
  checkout: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb"
  },
  totalBox: {
    background: "#111827",
    color: "white",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  paymentMessage: {
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "12px",
    borderRadius: "14px",
    marginBottom: "12px"
  },
  payButton: {
    width: "100%",
    padding: "15px 16px",
    border: "none",
    borderRadius: "16px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "16px"
  }
};

export default Shop;