import { useEffect, useState } from "react";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";

const text = {
  en: {
    store: "POLODIEU Store",
    heroTitle: "Electronics, phones, TVs & more",
    heroSub: "Best prices in Cameroon",
    products: "Products",
    search: "Search products...",
    all: "All",
    phones: "Phones",
    tv: "TV",
    laptops: "Laptops",
    category: "Category",
    stock: "Stock",
    addCart: "Add to Cart",
    cart: "Cart",
    empty: "Your cart is empty",
    total: "Total",
    checkout: "Checkout",
    remove: "Remove",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    orderSuccess: "Order placed successfully!",
    orderFail: "Order failed",
    cartEmpty: "Cart is empty"
  },
  fr: {
    store: "Boutique POLODIEU",
    heroTitle: "Électronique, téléphones, TV et plus",
    heroSub: "Meilleurs prix au Cameroun",
    products: "Produits",
    search: "Rechercher un produit...",
    all: "Tous",
    phones: "Téléphones",
    tv: "TV",
    laptops: "Ordinateurs",
    category: "Catégorie",
    stock: "Stock",
    addCart: "Ajouter au panier",
    cart: "Panier",
    empty: "Votre panier est vide",
    total: "Total",
    checkout: "Commander",
    remove: "Retirer",
    admin: "Admin",
    login: "Connexion",
    logout: "Déconnexion",
    orderSuccess: "Commande enregistrée avec succès !",
    orderFail: "Échec de la commande",
    cartEmpty: "Le panier est vide"
  }
};

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  if (window.location.pathname === "/login") return <Login />;

  if (window.location.pathname === "/admin") {
    const adminUser = JSON.parse(localStorage.getItem("user"));

    if (!adminUser || adminUser.role !== "ADMIN") {
      alert("Access denied");
      window.location.href = "/login";
      return null;
    }

    return <Admin />;
  }

  const t = text[lang];
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category ? p.category.toLowerCase() === category : true;
    return matchesSearch && matchesCategory;
  });

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item.id !== id));
  }

  async function checkout() {
    if (cart.length === 0) return alert(t.cartEmpty);

    const order = {
      phone: "680000000",
      address: "Yaounde",
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    const res = await fetch("http://localhost:4000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    if (!res.ok) return alert(t.orderFail);

    alert(t.orderSuccess);
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ fontFamily: "Arial", background: "#F5F6F8", minHeight: "100vh", color: "#111827" }}>
      <header style={{
        background: "linear-gradient(90deg, #E30613, #FF6B00)",
        color: "white",
        padding: "18px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)"
      }}>
        <h1 style={{ margin: 0 }}>{t.store}</h1>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
            {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
          </button>

          <a href="/admin" style={{ color: "white", fontWeight: "bold" }}>{t.admin}</a>

          {user ? (
            <button onClick={logout}>{t.logout}</button>
          ) : (
            <a href="/login" style={{ color: "white", fontWeight: "bold" }}>{t.login}</a>
          )}
        </div>
      </header>

      <section style={{
        background: "white",
        margin: "22px",
        padding: "35px",
        borderRadius: "18px",
        textAlign: "center",
        boxShadow: "0 4px 14px rgba(0,0,0,0.07)"
      }}>
        <h2 style={{ fontSize: "32px", marginBottom: "8px" }}>{t.heroTitle}</h2>
        <p style={{ color: "#6B7280", fontSize: "18px" }}>{t.heroSub}</p>
      </section>

      <main style={{
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: "22px",
        padding: "22px"
      }}>
        <section>
          <h2>{t.products}</h2>

          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "18px"
          }}>
            <input
              placeholder={t.search}
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                padding: "12px",
                flex: 1,
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                fontSize: "15px"
              }}
            />

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                fontSize: "15px"
              }}
            >
              <option value="">{t.all}</option>
              <option value="phones">{t.phones}</option>
              <option value="tv">{t.tv}</option>
              <option value="laptops">{t.laptops}</option>
            </select>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "22px"
          }}>
            {filteredProducts.map(p => (
              <div
                key={p.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  transition: "0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "170px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    background: "#F3F4F6"
                  }}
                />

                <h3>{p.name}</h3>

                <p style={{
                  color: "#E30613",
                  fontWeight: "bold",
                  fontSize: "20px"
                }}>
                  {p.price.toLocaleString()} FCFA
                </p>

                <p style={{ color: "#6B7280" }}>{t.category}: {p.category}</p>
                <p style={{ color: "#6B7280" }}>{t.stock}: {p.stock}</p>

                <button
                  onClick={() => addToCart(p)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#FF6B00",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {t.addCart}
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside style={{
          background: "white",
          padding: "22px",
          borderRadius: "18px",
          height: "fit-content",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          position: "sticky",
          top: "20px"
        }}>
          <h2>{t.cart} ({cartCount})</h2>

          {cart.length === 0 ? (
            <p style={{ color: "#6B7280" }}>{t.empty}</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{
                  marginBottom: "14px",
                  borderBottom: "1px solid #E5E7EB",
                  paddingBottom: "10px"
                }}>
                  <b>{item.name}</b>
                  <p>
                    x{item.quantity} — {(item.price * item.quantity).toLocaleString()} FCFA
                  </p>
                  <button onClick={() => removeFromCart(item.id)}>
                    {t.remove}
                  </button>
                </div>
              ))}

              <h3>{t.total}: {total.toLocaleString()} FCFA</h3>

              <button
                onClick={checkout}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "#16A34A",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {t.checkout}
              </button>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;