import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";
const WHATSAPP_NUMBER = "237651325289";

const defaultCategories = [
  "ALL",
  "Phones and Tablets",
  "Apple",
  "Informatique",
  "Gaming",
  "Home Appliances",
  "Small Appliances",
  "Electronics",
  "Network & Telecom",
  "Security",
  "Home & Office",
  "Tools & Equipment",
  "Supermarket",
  "Fashion",
  "Beauty & Wellness"
];

const categoryImages = {
  "Phones and Tablets":
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  Apple:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  Informatique:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  Gaming:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
  "Home Appliances":
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  "Small Appliances":
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80",
  Electronics:
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
  "Network & Telecom":
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80",
  Security:
    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
  "Home & Office":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "Tools & Equipment":
    "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80",
  Supermarket:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  Fashion:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  "Beauty & Wellness":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
};

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

  const dbCategories = products.map((p) => p.category).filter(Boolean);
  const categories = [...new Set([...defaultCategories, ...dbCategories])];

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
      <div style={styles.topBar}>
        <span>Call / WhatsApp: +237 651 325 289</span>
        <span>Fast local delivery • MTN MoMo accepted</span>
      </div>

      <header style={styles.header}>
        <div style={styles.logoBox}>
          <h1 style={styles.logo}>POLODIEU</h1>
          <p style={styles.logoSub}>Online Store</p>
        </div>

        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            placeholder="Search phones, electronics, fashion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={styles.searchButton}>Search</button>
        </div>

        <button style={styles.cartButton} onClick={() => setCartOpen(true)}>
          🛒 Cart <b>{cartCount}</b>
        </button>
      </header>

      <nav style={styles.menuBar}>
        <button style={styles.menuItem}>Home</button>
        <button style={styles.menuItem}>Flash Deals</button>
        <button style={styles.menuItem}>New Arrivals</button>
        <button style={styles.menuItem}>Best Sellers</button>
        <button style={styles.menuItem}>Delivery Info</button>
      </nav>

      <main style={styles.layout}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Categories</h3>

          {categories.map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.sideCategory,
                background: category === cat ? "#f97316" : "transparent",
                color: category === cat ? "white" : "#111827"
              }}
              onClick={() => setCategory(cat)}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </aside>

        <section style={styles.content}>
          <section style={styles.hero}>
            <div>
              <span style={styles.badge}>Cameroon Online Store</span>
              <h2 style={styles.heroTitle}>
                Big deals on phones, electronics, fashion and home essentials.
              </h2>
              <p style={styles.heroText}>
                Shop quality products, pay with MTN MoMo, and confirm your order
                instantly through WhatsApp.
              </p>
              <button
                style={styles.heroButton}
                onClick={() =>
                  window.scrollTo({ top: 620, behavior: "smooth" })
                }
              >
                Shop Now
              </button>
            </div>
          </section>

          <section style={styles.categoryTiles}>
            {defaultCategories
              .filter((cat) => cat !== "ALL")
              .map((cat) => (
                <button
                  key={cat}
                  style={{
                    ...styles.categoryTile,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url(${categoryImages[cat]})`
                  }}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
          </section>

          <section style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                {category === "ALL" ? "Featured Products" : category}
              </h2>
              <p style={styles.muted}>
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <select
              style={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </section>

          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <h3>No products available right now</h3>
              <p style={styles.muted}>
                Add products in this category from your admin panel.
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

                    <p style={styles.price}>
                      {Number(p.price).toLocaleString()} FCFA
                    </p>

                    <p style={styles.stock}>Stock: {p.stock}</p>

                    <button
                      style={{
                        ...styles.addButton,
                        opacity: p.stock <= 0 ? 0.45 : 1,
                        cursor: p.stock <= 0 ? "not-allowed" : "pointer"
                      }}
                      disabled={p.stock <= 0}
                      onClick={() => addToCart(p)}
                    >
                      {p.stock <= 0 ? "Unavailable" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}

          <section style={styles.trustSection}>
            <div>✅ Secure MTN MoMo Payment</div>
            <div>🚚 Local Delivery</div>
            <div>💬 WhatsApp Confirmation</div>
            <div>🛒 Easy Shopping</div>
          </section>
        </section>
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
                          {(Number(item.price) * item.quantity).toLocaleString()}{" "}
                          FCFA
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
    background: "#f3f4f6",
    color: "#111827",
    fontFamily: "Arial, sans-serif"
  },
  topBar: {
    background: "#111827",
    color: "white",
    padding: "9px 24px",
    fontSize: "13px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap"
  },
  header: {
    background: "white",
    padding: "18px 24px",
    display: "grid",
    gridTemplateColumns: "220px 1fr 130px",
    gap: "18px",
    alignItems: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 20
  },
  logoBox: {
    lineHeight: 1
  },
  logo: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
    letterSpacing: "-1px",
    color: "#f97316"
  },
  logoSub: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#6b7280"
  },
  searchBox: {
    display: "flex",
    border: "2px solid #f97316",
    borderRadius: "8px",
    overflow: "hidden",
    background: "white"
  },
  searchInput: {
    flex: 1,
    border: "none",
    padding: "13px",
    fontSize: "15px",
    outline: "none"
  },
  searchButton: {
    border: "none",
    background: "#f97316",
    color: "white",
    padding: "0 20px",
    fontWeight: "800",
    cursor: "pointer"
  },
  cartButton: {
    border: "none",
    background: "#111827",
    color: "white",
    padding: "13px 15px",
    borderRadius: "8px",
    fontWeight: "800",
    cursor: "pointer"
  },
  menuBar: {
    background: "#f97316",
    color: "white",
    padding: "0 24px",
    display: "flex",
    gap: "4px",
    overflowX: "auto"
  },
  menuItem: {
    border: "none",
    background: "transparent",
    color: "white",
    padding: "13px 16px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  layout: {
    maxWidth: "1320px",
    margin: "22px auto",
    padding: "0 18px",
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    gap: "20px"
  },
  sidebar: {
    background: "white",
    borderRadius: "12px",
    padding: "14px",
    height: "fit-content",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    position: "sticky",
    top: "105px"
  },
  sidebarTitle: {
    margin: "0 0 12px",
    fontSize: "18px"
  },
  sideCategory: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "11px 12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    marginBottom: "4px"
  },
  content: {
    minWidth: 0
  },
  hero: {
    minHeight: "300px",
    borderRadius: "16px",
    padding: "38px",
    color: "white",
    display: "flex",
    alignItems: "center",
    background:
      "linear-gradient(90deg, rgba(17,24,39,0.95), rgba(249,115,22,0.72)), url(https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1600&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 10px 28px rgba(0,0,0,0.15)"
  },
  badge: {
    background: "rgba(255,255,255,0.18)",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "13px"
  },
  heroTitle: {
    fontSize: "clamp(32px, 5vw, 56px)",
    lineHeight: 1,
    maxWidth: "760px",
    margin: "18px 0"
  },
  heroText: {
    maxWidth: "640px",
    fontSize: "17px",
    color: "#f9fafb",
    lineHeight: 1.6
  },
  heroButton: {
    marginTop: "12px",
    border: "none",
    background: "white",
    color: "#111827",
    padding: "14px 22px",
    borderRadius: "8px",
    fontWeight: "900",
    cursor: "pointer"
  },
  categoryTiles: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: "12px",
    margin: "18px 0"
  },
  categoryTile: {
    height: "110px",
    border: "none",
    borderRadius: "14px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    fontWeight: "900",
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left",
    padding: "14px",
    display: "flex",
    alignItems: "end",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
  },
  sectionHeader: {
    background: "white",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
  },
  sectionTitle: {
    margin: 0,
    fontSize: "24px"
  },
  muted: {
    color: "#6b7280",
    margin: "6px 0"
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  },
  card: {
    background: "white",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 5px 18px rgba(0,0,0,0.07)"
  },
  imageWrap: {
    position: "relative",
    background: "#e5e7eb"
  },
  image: {
    width: "100%",
    height: "210px",
    objectFit: "cover",
    display: "block"
  },
  noImage: {
    height: "210px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280"
  },
  stockBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#dc2626",
    color: "white",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800"
  },
  cardBody: {
    padding: "14px"
  },
  category: {
    margin: 0,
    color: "#f97316",
    fontWeight: "900",
    fontSize: "12px",
    textTransform: "uppercase"
  },
  productName: {
    margin: "8px 0",
    fontSize: "17px"
  },
  price: {
    color: "#111827",
    fontWeight: "900",
    margin: "6px 0"
  },
  stock: {
    color: "#6b7280",
    margin: "5px 0",
    fontSize: "13px"
  },
  addButton: {
    width: "100%",
    marginTop: "10px",
    border: "none",
    background: "#f97316",
    color: "white",
    borderRadius: "8px",
    padding: "12px",
    fontWeight: "900",
    cursor: "pointer"
  },
  emptyState: {
    background: "white",
    borderRadius: "14px",
    padding: "34px",
    textAlign: "center"
  },
  trustSection: {
    margin: "24px 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000
  },
  drawer: {
    width: "100%",
    maxWidth: "460px",
    height: "100vh",
    background: "white",
    padding: "22px",
    boxSizing: "border-box",
    overflowY: "auto"
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "14px",
    marginBottom: "16px"
  },
  closeBtn: {
    border: "none",
    background: "#111827",
    color: "white",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer"
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
    borderRadius: "12px",
    padding: "12px"
  },
  cartImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px"
  },
  cartNoImage: {
    width: "80px",
    height: "80px",
    borderRadius: "10px",
    background: "#e5e7eb",
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
    flexWrap: "wrap"
  },
  qtyBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: "900"
  },
  removeBtn: {
    padding: "8px 10px",
    border: "none",
    borderRadius: "8px",
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
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "14px",
    display: "flex",
    justifyContent: "space-between"
  },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    marginBottom: "12px",
    boxSizing: "border-box"
  },
  paymentMessage: {
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "12px"
  },
  payButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "16px"
  }
};

export default Shop;