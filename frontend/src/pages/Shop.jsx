import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";
const WHATSAPP_NUMBER = "237651325289";

const promoSlides = [
  {
    title: "Big Tech Deals",
    text: "Phones, laptops, accessories and electronics at great prices.",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Home Essentials",
    text: "Upgrade your home with appliances, office items and tools.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Fashion & Beauty",
    text: "Shop stylish fashion, beauty and wellness products.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80"
  }
];

const demoProducts = [
  {
    id: "demo-phone-1",
    name: "Tecno Spark Smartphone",
    category: "Phones and Tablets",
    price: 105000,
    stock: 15,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-phone-2",
    name: "Android Tablet 10 Inch",
    category: "Phones and Tablets",
    price: 85000,
    stock: 10,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-apple-1",
    name: "iPhone 13",
    category: "Apple",
    price: 350000,
    stock: 7,
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-apple-2",
    name: "MacBook Air",
    category: "Apple",
    price: 650000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-computer-1",
    name: "HP Laptop Core i5",
    category: "Informatique",
    price: 280000,
    stock: 8,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-computer-2",
    name: "Wireless Keyboard & Mouse",
    category: "Informatique",
    price: 18000,
    stock: 20,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-gaming-1",
    name: "Gaming Controller",
    category: "Gaming",
    price: 25000,
    stock: 12,
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-gaming-2",
    name: "Gaming Headset",
    category: "Gaming",
    price: 30000,
    stock: 10,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-appliance-1",
    name: "Double Door Refrigerator",
    category: "Home Appliances",
    price: 220000,
    stock: 4,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-appliance-2",
    name: "Washing Machine",
    category: "Home Appliances",
    price: 180000,
    stock: 3,
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-small-1",
    name: "Electric Blender",
    category: "Small Appliances",
    price: 25000,
    stock: 18,
    image: "https://images.unsplash.com/photo-1585237672814-8f85a8118bf5?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-small-2",
    name: "Electric Kettle",
    category: "Small Appliances",
    price: 12000,
    stock: 25,
    image: "https://images.unsplash.com/photo-1571552879083-e93b6ea70d1d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-electronics-1",
    name: "32 Inch Smart TV",
    category: "Electronics",
    price: 85000,
    stock: 9,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-electronics-2",
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 18000,
    stock: 16,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-network-1",
    name: "WiFi Router",
    category: "Network & Telecom",
    price: 28000,
    stock: 14,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-security-1",
    name: "CCTV Security Camera",
    category: "Security",
    price: 35000,
    stock: 8,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-office-1",
    name: "Office Chair",
    category: "Home & Office",
    price: 45000,
    stock: 11,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-tools-1",
    name: "Tool Box Set",
    category: "Tools & Equipment",
    price: 30000,
    stock: 10,
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-market-1",
    name: "Grocery Pack",
    category: "Supermarket",
    price: 15000,
    stock: 30,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-fashion-1",
    name: "Classic Sneakers",
    category: "Fashion",
    price: 25000,
    stock: 13,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "demo-beauty-1",
    name: "Beauty Care Set",
    category: "Beauty & Wellness",
    price: 18000,
    stock: 15,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
  }
];

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

function Shop() {
  const [products, setProducts] = useState([]);
  const [slide, setSlide] = useState(0);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % promoSlides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();

      const realProducts = Array.isArray(data) ? data : [];
      setProducts([...realProducts, ...demoProducts]);
    } catch {
      setProducts(demoProducts);
    }
  }

  const categories = [
    ...new Set([
      ...defaultCategories,
      ...products.map((p) => p.category).filter(Boolean)
    ])
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
        alert("Only real admin products can be ordered. Demo products are for display.");
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

  const currentPromo = promoSlides[slide];

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <span>Call / WhatsApp: +237 651 325 289</span>
        <span>Fast local delivery • MTN MoMo accepted</span>
      </div>

      <header style={styles.header}>
        <div>
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
          <section
            style={{
              ...styles.hero,
              backgroundImage: `linear-gradient(90deg, rgba(17,24,39,0.95), rgba(249,115,22,0.65)), url(${currentPromo.image})`
            }}
          >
            <div>
              <span style={styles.badge}>Moving Promotion</span>
              <h2 style={styles.heroTitle}>{currentPromo.title}</h2>
              <p style={styles.heroText}>{currentPromo.text}</p>
              <button
                style={styles.heroButton}
                onClick={() => window.scrollTo({ top: 620, behavior: "smooth" })}
              >
                Shop Now
              </button>

              <div style={styles.dots}>
                {promoSlides.map((_, index) => (
                  <span
                    key={index}
                    style={{
                      ...styles.dot,
                      background: slide === index ? "#f97316" : "white"
                    }}
                  />
                ))}
              </div>
            </div>
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

          <section style={styles.grid}>
            {filteredProducts.map((p) => (
              <article key={p.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}

                  {String(p.id).startsWith("demo") && (
                    <span style={styles.demoBadge}>Estimate</span>
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
                    style={styles.addButton}
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </section>

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
                      <img src={item.image} alt={item.name} style={styles.cartImage} />

                      <div style={{ flex: 1 }}>
                        <h3 style={styles.cartName}>{item.name}</h3>
                        <p style={styles.price}>
                          {(Number(item.price) * item.quantity).toLocaleString()} FCFA
                        </p>

                        <div style={styles.qtyRow}>
                          <button style={styles.qtyBtn} onClick={() => changeQuantity(item.id, -1)}>
                            −
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

                  <button style={styles.payButton} onClick={handleCheckout} disabled={loading}>
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
  page: { minHeight: "100vh", background: "#f3f4f6", color: "#111827", fontFamily: "Arial, sans-serif" },
  topBar: { background: "#111827", color: "white", padding: "9px 24px", fontSize: "13px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" },
  header: { background: "white", padding: "18px 24px", display: "grid", gridTemplateColumns: "220px 1fr 130px", gap: "18px", alignItems: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 20 },
  logo: { margin: 0, fontSize: "30px", fontWeight: "900", color: "#f97316" },
  logoSub: { margin: "4px 0 0", fontSize: "13px", color: "#6b7280" },
  searchBox: { display: "flex", border: "2px solid #f97316", borderRadius: "8px", overflow: "hidden" },
  searchInput: { flex: 1, border: "none", padding: "13px", fontSize: "15px", outline: "none" },
  searchButton: { border: "none", background: "#f97316", color: "white", padding: "0 20px", fontWeight: "800" },
  cartButton: { border: "none", background: "#111827", color: "white", padding: "13px", borderRadius: "8px", fontWeight: "800" },
  menuBar: { background: "#f97316", padding: "0 24px", display: "flex", overflowX: "auto" },
  menuItem: { border: "none", background: "transparent", color: "white", padding: "13px 16px", fontWeight: "700", whiteSpace: "nowrap" },
  layout: { maxWidth: "1320px", margin: "22px auto", padding: "0 18px", display: "grid", gridTemplateColumns: "250px 1fr", gap: "20px" },
  sidebar: { background: "white", borderRadius: "12px", padding: "14px", height: "fit-content", boxShadow: "0 4px 14px rgba(0,0,0,0.06)" },
  sidebarTitle: { margin: "0 0 12px" },
  sideCategory: { display: "block", width: "100%", textAlign: "left", padding: "11px 12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", marginBottom: "4px" },
  content: { minWidth: 0 },
  hero: { minHeight: "320px", borderRadius: "16px", padding: "38px", color: "white", display: "flex", alignItems: "center", backgroundSize: "cover", backgroundPosition: "center", transition: "0.5s ease" },
  badge: { background: "rgba(255,255,255,0.18)", padding: "8px 12px", borderRadius: "999px", fontWeight: "800", fontSize: "13px" },
  heroTitle: { fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1, maxWidth: "760px", margin: "18px 0" },
  heroText: { maxWidth: "640px", fontSize: "17px", color: "#f9fafb", lineHeight: 1.6 },
  heroButton: { marginTop: "12px", border: "none", background: "white", color: "#111827", padding: "14px 22px", borderRadius: "8px", fontWeight: "900" },
  dots: { display: "flex", gap: "8px", marginTop: "18px" },
  dot: { width: "34px", height: "6px", borderRadius: "999px", display: "inline-block" },
  sectionHeader: { background: "white", borderRadius: "12px", padding: "16px", margin: "18px 0 16px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", boxShadow: "0 4px 14px rgba(0,0,0,0.06)" },
  sectionTitle: { margin: 0, fontSize: "24px" },
  muted: { color: "#6b7280", margin: "6px 0" },
  select: { padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" },
  card: { background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 5px 18px rgba(0,0,0,0.07)" },
  imageWrap: { position: "relative", background: "#e5e7eb" },
  image: { width: "100%", height: "210px", objectFit: "cover", display: "block" },
  noImage: { height: "210px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" },
  demoBadge: { position: "absolute", top: "10px", right: "10px", background: "#f97316", color: "white", padding: "6px 9px", borderRadius: "999px", fontSize: "12px", fontWeight: "800" },
  cardBody: { padding: "14px" },
  category: { margin: 0, color: "#f97316", fontWeight: "900", fontSize: "12px", textTransform: "uppercase" },
  productName: { margin: "8px 0", fontSize: "17px" },
  price: { color: "#111827", fontWeight: "900", margin: "6px 0" },
  stock: { color: "#6b7280", margin: "5px 0", fontSize: "13px" },
  addButton: { width: "100%", marginTop: "10px", border: "none", background: "#f97316", color: "white", borderRadius: "8px", padding: "12px", fontWeight: "900" },
  trustSection: { margin: "24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "flex-end", zIndex: 1000 },
  drawer: { width: "100%", maxWidth: "460px", height: "100vh", background: "white", padding: "22px", boxSizing: "border-box", overflowY: "auto" },
  drawerHeader: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", paddingBottom: "14px", marginBottom: "16px" },
  closeBtn: { border: "none", background: "#111827", color: "white", borderRadius: "8px", padding: "8px 12px" },
  emptyCart: { textAlign: "center", padding: "50px 0" },
  cartItems: { display: "grid", gap: "12px" },
  cartItem: { display: "flex", gap: "12px", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px" },
  cartImage: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" },
  cartName: { margin: "0 0 6px", fontSize: "16px" },
  qtyRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  qtyBtn: { width: "30px", height: "30px", borderRadius: "8px", border: "1px solid #d1d5db", background: "white", fontWeight: "900" },
  removeBtn: { padding: "8px 10px", border: "none", borderRadius: "8px", background: "#fee2e2", color: "#991b1b", fontWeight: "800" },
  checkout: { marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" },
  totalBox: { background: "#111827", color: "white", borderRadius: "12px", padding: "16px", marginBottom: "14px", display: "flex", justifyContent: "space-between" },
  input: { width: "100%", padding: "13px", borderRadius: "10px", border: "1px solid #d1d5db", marginBottom: "12px", boxSizing: "border-box" },
  paymentMessage: { background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#166534", padding: "12px", borderRadius: "10px", marginBottom: "12px" },
  payButton: { width: "100%", padding: "14px", border: "none", borderRadius: "10px", background: "#16a34a", color: "white", fontWeight: "900", fontSize: "16px" }
};

export default Shop;