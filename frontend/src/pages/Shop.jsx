import { useEffect, useState } from "react";

const API_URL = "https://polodieu-shop.onrender.com";
const WHATSAPP_NUMBER = "237651325289";

function getDiscount(product) {
  return 10 + (product.name.length % 15);
}

function getOldPrice(product) {
  const discount = getDiscount(product);
  return Math.round(Number(product.price) / (1 - discount / 100));
}

function getRating(product) {
  return (4 + (product.name.length % 10) / 10).toFixed(1);
}

const promoSlides = [
  {
    title: "Big Home & Electronics Deals",
    text: "Smart TVs, appliances, soundbars, furniture and more.",
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Upgrade Your Home",
    text: "Shop washing machines, fridges, microwaves and kitchen items.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Office & Furniture",
    text: "Office chairs, tables, TV stands and dining sets.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80"
  }
];

const demoProducts = [
  {
    id: "tv-samsung",
    name: 'Samsung Smart TV 43"',
    category: "Smart TVs",
    price: 160000,
    stock: 8,
    description: "Samsung 43 inch smart TV with clear picture quality, HDMI support, USB support, and internet apps.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "tv-lg",
    name: 'LG Smart TV 50"',
    category: "Smart TVs",
    price: 220000,
    stock: 6,
    description: "LG 50 inch smart TV with bright display, streaming apps, and modern slim design.",
    image:
      "https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "washing-machine",
    name: "Washing Machine",
    category: "Home Appliances",
    price: 180000,
    stock: 4,
    description: "Automatic washing machine suitable for home use with strong washing performance.",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "microwave",
    name: "Microwave Oven",
    category: "Home Appliances",
    price: 75000,
    stock: 6,
    description: "Microwave oven for heating, cooking, and quick meal preparation.",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "soundbar-samsung",
    name: "Samsung Soundbar",
    category: "Soundbars",
    price: 85000,
    stock: 7,
    description: "Samsung soundbar with powerful bass and clear home cinema audio.",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "soundbar-lg",
    name: "LG Soundbar",
    category: "Soundbars",
    price: 90000,
    stock: 6,
    description: "LG soundbar for TV, music, movies, and improved home entertainment sound.",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "soundbar-sony",
    name: "Sony Soundbar",
    category: "Soundbars",
    price: 120000,
    stock: 5,
    description: "Sony soundbar with premium audio quality and deep bass experience.",
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gas-cooker",
    name: "Gas Cooker",
    category: "Kitchen Appliances",
    price: 95000,
    stock: 5,
    description: "Durable gas cooker for daily cooking, suitable for family kitchen use.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "electric-iron",
    name: "Electric Iron",
    category: "Small Appliances",
    price: 12000,
    stock: 20,
    description: "Electric iron for smooth clothes finishing and everyday home use.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "water-boiler",
    name: "Water Boiler",
    category: "Small Appliances",
    price: 10000,
    stock: 25,
    description: "Fast water boiler for tea, coffee, and kitchen use.",
    image:
      "https://images.unsplash.com/photo-1571552879083-e93b6ea70d1d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "blender",
    name: "Electric Blender",
    category: "Small Appliances",
    price: 18000,
    stock: 18,
    description: "Electric blender for juice, smoothies, sauce, and food preparation.",
    image:
      "https://images.unsplash.com/photo-1585237672814-8f85a8118bf5?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "fan",
    name: "Standing Fan",
    category: "Home & Office",
    price: 25000,
    stock: 12,
    description: "Standing fan with strong airflow, ideal for home and office cooling.",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22731c2c9f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "fridge",
    name: "Double Door Fridge",
    category: "Home Appliances",
    price: 250000,
    stock: 3,
    description: "Double door fridge with large storage capacity for food and drinks.",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "distributor",
    name: "Power Extension Distributor",
    category: "Electronics",
    price: 8000,
    stock: 30,
    description: "Power extension distributor for connecting multiple appliances safely.",
    image:
      "https://images.unsplash.com/photo-1581093588401-22f5a78cbe64?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "tv-stand",
    name: "TV Stand",
    category: "Furniture",
    price: 45000,
    stock: 6,
    description: "Modern TV stand for living room setup and media storage.",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "stabilizer",
    name: "Regulator / Stabilizer",
    category: "Electronics",
    price: 35000,
    stock: 10,
    description: "Voltage regulator/stabilizer to help protect electronics from power fluctuation.",
    image:
      "https://images.unsplash.com/photo-1581090700227-1e8e0a5c8f19?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "office-chair",
    name: "Office Chair",
    category: "Furniture",
    price: 40000,
    stock: 10,
    description: "Comfortable office chair for work, study, and business use.",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "office-table",
    name: "Office Table",
    category: "Furniture",
    price: 60000,
    stock: 7,
    description: "Office table suitable for home office, business office, and study setup.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "dining-set",
    name: "Dining Set",
    category: "Furniture",
    price: 180000,
    stock: 4,
    description: "Dining table set for family meals and modern home decoration.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80"
  }
];

const defaultCategories = [
  "ALL",
  "Smart TVs",
  "Soundbars",
  "Home Appliances",
  "Kitchen Appliances",
  "Small Appliances",
  "Electronics",
  "Furniture",
  "Home & Office"
];
const megaCategories = [
  {
    title: "Phones And Tablets",
    groups: [
      {
        heading: "Phones And Tablets",
        items: [
          "Téléphones Par Types",
          "Smartphones par marques",
          "Phone Accessories",
          "Tablettes",
          "Landline Phones",
          "Top Collections",
        ],
      },
      {
        heading: "Apple",
        items: ["Iphone", "Apple Mac", "Ipads", "Autres Accessoires Apple"],
      },
    ],
  },
  {
    title: "Informatique",
    groups: [
      {
        heading: "Informatique",
        items: [
          "Ordinateurs portables",
          "Computers and Peripherals",
          "Data Storage",
          "Ordinateurs de bureau",
          "Imprimantes et scanners",
          "Top Marques",
          "Top Collections",
        ],
      },
    ],
  },
  {
    title: "Gaming et jeux videos",
    groups: [
      {
        heading: "Gaming et jeux videos",
        items: ["Playstation", "XBOX", "Gaming PC", "Nintendo"],
      },
    ],
  },
  {
    title: "Gros électroménager",
    groups: [
      {
        heading: "Gros électroménager",
        items: [
          "Refrigerators and Freezers",
          "Gas Stoves and Plates",
          "Washing and Drying Machines",
          "Climatiseurs et ventilateurs",
        ],
      },
    ],
  },
  {
    title: "Small Appliances",
    groups: [
      {
        heading: "Small Appliances",
        items: [
          "Cuisine et art de la table",
          "Household Appliances",
          "Appareils de patisserie et jus",
          "Appareils pour petit dej",
          "Appareils de cuisson",
          "Blender et hachoir",
          "Appareils pour la Transformation",
        ],
      },
    ],
  },
  {
    title: "Electronique",
    groups: [
      {
        heading: "Electronique",
        items: [
          "Televisions",
          "Instruments de musique",
          "Accessoires TV",
          "Electricity",
          "Audio & HIFI",
        ],
      },
      {
        heading: "Reseau et Telecom",
        items: [
          "Communication",
          "Connectiques WIFI",
          "Nos Boutiques",
          "Énergie Solaire et Électrique",
          "Our Phone Solutions for Business",
        ],
      },
    ],
  },
  {
    title: "Electronic Security",
    groups: [
      {
        heading: "Electronic Security",
        items: [
          "Alarm incendie",
          "Esser",
          "GPS et navigation",
          "Bill Counter and Detector",
          "Videosurveillance",
          "Alarm intrusion",
          "Nos boutiques",
          "Nos top marques",
          "Contrôle d'Accès",
        ],
      },
    ],
  },
  {
    title: "Bureau & Maison",
    groups: [
      {
        heading: "Bureau & Maison",
        items: [
          "Chambre et literie",
          "Sale de bain",
          "Salon et sale a manger",
          "Decoration",
          "Bureau",
          "Seasonal Decoration",
        ],
      },
    ],
  },
  {
    title: "Outillage et EPI",
    groups: [
      {
        heading: "Outillage et EPI",
        items: [
          "Electric Tools",
          "Outillage stationnaire",
          "Hand Tools",
          "Construction Material",
          "Nettoyage",
          "EPI",
          "Welding Material",
          "Generators",
          "Jardinage",
        ],
      },
    ],
  },
  {
    title: "Supermarket",
    groups: [
      {
        heading: "Supermarket",
        items: [
          "ALIMENTAIRE",
          "PETIT DEJEUNER",
          "ENTRETIENT ET DIVERS",
          "TOILETTE",
          "ENFANTS ET NOURRISSONS",
        ],
      },
    ],
  },
  {
    title: "LA CAVE",
    groups: [
      {
        heading: "LA CAVE",
        items: [
          "Vins-Grands Crus",
          "Champagnes & autres bulles",
          "Sélection Alcools",
          "Bières & Cidres",
          "La cave sans alcool",
        ],
      },
    ],
  },
  {
    title: "Fashion",
    groups: [
      {
        heading: "Fashion",
        items: [
          "Chaussure femme",
          "Accessoire homme",
          "Couture africaine",
          "Chaussure homme",
          "Accessoire femme",
          "Women's Clothing",
          "Men's Clothing",
        ],
      },
    ],
  },
  {
    title: "Beauty and Wellness",
    groups: [{ heading: "Beauty and Wellness", items: [] }],
  },
  {
    title: "Cinematography",
    groups: [
      {
        heading: "Cinematography",
        items: ["Appareils Photo", "Caméras", "Matériels d'Observation"],
      },
    ],
  },
  {
    title: "ENFANTS ET MATERNITE",
    groups: [{ heading: "ENFANTS ET MATERNITE", items: [] }],
  },
];
function Shop() {
  const [products, setProducts] = useState([]);
  const [slide, setSlide] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMega, setActiveMega] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    loadProducts();

    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
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
        openWhatsAppOrder("WHATSAPP-ORDER");
        alert("Order sent to WhatsApp. Demo items are display items.");
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
    <div style={{ ...styles.page, paddingBottom: isMobile ? "76px" : 0 }}>
      <div style={styles.topBar}>
        <span>🚚 Fast delivery in Cameroon</span>
        <span>📞 WhatsApp: +237 651 325 289</span>
      </div>

      <header
        style={{
          ...styles.header,
          gridTemplateColumns: isMobile ? "1fr" : "220px 1fr 130px"
        }}
      >
        <div>
          <h1 style={styles.logo}>POLODIEU</h1>
          <p style={styles.logoSub}>Online Store</p>
        </div>

        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            placeholder="Search TVs, appliances, furniture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={styles.searchButton}>Search</button>
        </div>

        {!isMobile && (
          <button style={styles.cartButton} onClick={() => setCartOpen(true)}>
            🛒 Cart <b>{cartCount}</b>
          </button>
        )}
      </header>

      <nav style={styles.menuBar}>
        <button style={styles.menuItem}>Home</button>
        <button style={styles.menuItem}>Flash Deals</button>
        <button style={styles.menuItem}>New Arrivals</button>
        <button style={styles.menuItem}>Best Sellers</button>
        <button style={styles.menuItem}>Delivery Info</button>
      </nav>

      <main
        style={{
          ...styles.layout,
          gridTemplateColumns: isMobile ? "1fr" : "250px 1fr"
        }}
      >
       <aside style={isMobile ? styles.mobileCategories : styles.sidebar}>
  {!isMobile && <h3 style={styles.sidebarTitle}>Toutes les catégories</h3>}

  {megaCategories.map((cat) => (
    <div key={cat.title} style={styles.megaItemWrap}>
      <button
        style={styles.megaCategoryBtn}
        onMouseEnter={() => !isMobile && setActiveMega(cat)}
        onClick={() => {
          setCategory(cat.title);
          if (isMobile) setActiveMega(activeMega?.title === cat.title ? null : cat);
        }}
      >
        <span>{cat.title}</span>
        <span>›</span>
      </button>

      {isMobile && activeMega?.title === cat.title && (
        <div style={styles.mobileMegaPanel}>
          {cat.groups.map((group) => (
            <div key={group.heading}>
              <h4 style={styles.megaHeading}>{group.heading}</h4>
              {group.items.map((item) => (
                <button
                  key={item}
                  style={styles.megaSubItem}
                  onClick={() => setSearch(item)}
                >
                  {item} <span>›</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  ))}

  {!isMobile && activeMega && (
    <div
      style={styles.megaPanel}
      onMouseLeave={() => setActiveMega(null)}
    >
      {activeMega.groups.map((group) => (
        <div key={group.heading} style={styles.megaGroup}>
          <h3 style={styles.megaHeading}>{group.heading}</h3>

          {group.items.map((item) => (
            <button
              key={item}
              style={styles.megaSubItem}
              onClick={() => {
                setSearch(item);
                setActiveMega(null);
              }}
            >
              {item} <span>›</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  )}
</aside>

        <section style={styles.content}>
          <section
            style={{
              ...styles.hero,
              minHeight: isMobile ? "220px" : "320px",
              padding: isMobile ? "22px" : "38px",
              backgroundImage: `linear-gradient(90deg, rgba(17,24,39,0.95), rgba(249,115,22,0.65)), url(${currentPromo.image})`
            }}
          >
            <div>
              <span style={styles.badge}>Moving Promotion</span>
              <h2
                style={{
                  ...styles.heroTitle,
                  fontSize: isMobile ? "30px" : "clamp(32px, 5vw, 56px)"
                }}
              >
                {currentPromo.title}
              </h2>
              <p style={styles.heroText}>{currentPromo.text}</p>

              <button
                style={styles.heroButton}
                onClick={() =>
                  window.scrollTo({ top: 620, behavior: "smooth" })
                }
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

          <section style={styles.flashDeals}>
            <div>
              <h2 style={styles.flashTitle}>🔥 Flash Deals</h2>
              <p style={styles.flashText}>
                Limited-time offers. Prices may change soon.
              </p>
            </div>

            <div
              style={{
                ...styles.flashGrid,
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(auto-fit, minmax(180px, 1fr))"
              }}
            >
              {products.slice(0, 4).map((p) => (
                <div key={p.id} style={styles.flashCard}>
                 <img
  src={p.images?.[0] || p.image}
  alt={p.name}
  style={styles.flashImage}
/>
                  <b>{p.name}</b>
                  <p style={styles.oldPrice}>
                    {getOldPrice(p).toLocaleString()} FCFA
                  </p>
                  <p style={styles.flashPrice}>
                    {Number(p.price).toLocaleString()} FCFA
                  </p>
                </div>
              ))}
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

          <section
            style={{
              ...styles.grid,
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(auto-fit, minmax(220px, 1fr))",
              gap: isMobile ? "10px" : "16px"
            }}
          >
            {filteredProducts.map((p) => (
              <article key={p.id} style={styles.card}>
                <div style={styles.imageWrap}>
  <span style={styles.discountBadge}>-{getDiscount(p)}%</span>

  {p.images?.[0] || p.image ? (
  <img
    src={p.images?.[0] || p.image}
    alt={p.name}
    style={{
      ...styles.image,
      height: isMobile ? "130px" : "210px"
    }}
  />
) : (
  <div style={styles.noImage}>No Image</div>
)}
</div>

                <div
                  style={{
                    ...styles.cardBody,
                    padding: isMobile ? "10px" : "14px"
                  }}
                >
                  <p style={styles.category}>{p.category || "General"}</p>
                  <h3
                    style={{
                      ...styles.productName,
                      fontSize: isMobile ? "14px" : "17px"
                    }}
                  >
                    {p.name}
                  </h3>

                  <p style={styles.rating}>★★★★★ ({getRating(p)})</p>

                  <p style={styles.oldPrice}>
                    {getOldPrice(p).toLocaleString()} FCFA
                  </p>

                  <p style={styles.price}>
                    {Number(p.price).toLocaleString()} FCFA
                  </p>

                  <button
                    style={styles.viewBtn}
                    onClick={() => setSelectedProduct(p)}
                  >
                    View Details
                  </button>

                  <button style={styles.addButton} onClick={() => addToCart(p)}>
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

{selectedProduct && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalFlex}>

      {/* LEFT IMAGE */}
      <div style={styles.modalLeft}>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          style={styles.mainImage}
        />

        <div style={styles.thumbnailRow}>
          {[
  selectedProduct.image,
  selectedProduct.image,
  selectedProduct.image,
  selectedProduct.image,
  selectedProduct.image
].map((img, i) => (
  <img key={i} src={img} style={styles.thumb} />
))}
           
        </div>
      </div>

      {/* RIGHT DETAILS */}
      <div style={styles.modalRight}>
        <h2>{selectedProduct.name}</h2>

        <p style={styles.rating}>
          ★★★★★ ({getRating(selectedProduct)})
        </p>

        <p style={styles.oldPrice}>
          {getOldPrice(selectedProduct).toLocaleString()} FCFA
        </p>

        <h3 style={styles.price}>
          {Number(selectedProduct.price).toLocaleString()} FCFA
        </h3>

        <p style={styles.muted}>
          {selectedProduct.description || "High quality product"}
        </p>

        <button
          style={styles.addButton}
          onClick={() => {
            addToCart(selectedProduct);
            setSelectedProduct(null);
          }}
        >
          Add to Cart
        </button>

        <button
          style={styles.closeModalBtn}
          onClick={() => setSelectedProduct(null)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
      
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
                      <img
                        src={item.image}
                        alt={item.name}
                        style={styles.cartImage}
                      />

                      <div style={{ flex: 1 }}>
                        <h3 style={styles.cartName}>{item.name}</h3>

                        <p style={styles.price}>
                          {(Number(item.price) * item.quantity).toLocaleString()}{" "}
                          FCFA
                        </p>

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
                    style={styles.payButton}
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

      <nav style={styles.bottomNav}>
        <button style={styles.bottomNavBtn}>🏠 Home</button>
        <button style={styles.bottomNavBtn} onClick={() => setCartOpen(true)}>
          🛒 Cart ({cartCount})
        </button>
        <button style={styles.bottomNavBtn}>👤 Account</button>
      </nav>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    color: "#111827",
    fontFamily: "Arial, sans-serif",
    overflowX: "hidden"
  },
  topBar: {
    background: "#111827",
    color: "white",
    padding: "9px 16px",
    fontSize: "13px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap"
  },
  header: {
    background: "white",
    padding: "16px",
    display: "grid",
    gap: "14px",
    alignItems: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 20
  },
  logo: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
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
    width: "100%"
  },
  searchInput: {
    flex: 1,
    border: "none",
    padding: "13px",
    fontSize: "15px",
    outline: "none",
    minWidth: 0
  },
  searchButton: {
    border: "none",
    background: "#f97316",
    color: "white",
    padding: "0 16px",
    fontWeight: "800"
  },
  cartButton: {
    border: "none",
    background: "#111827",
    color: "white",
    padding: "13px",
    borderRadius: "8px",
    fontWeight: "800"
  },
  menuBar: {
    background: "#f97316",
    padding: "0 14px",
    display: "flex",
    overflowX: "auto"
  },
  menuItem: {
    border: "none",
    background: "transparent",
    color: "white",
    padding: "13px 16px",
    fontWeight: "700",
    whiteSpace: "nowrap"
  },
  layout: {
    maxWidth: "1320px",
    margin: "18px auto",
    padding: "0 12px",
    display: "grid",
    gap: "16px"
  },
  sidebar: {
    background: "white",
    borderRadius: "12px",
    padding: "14px",
    height: "fit-content",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    position: "sticky",
    top: "110px"
  },
  mobileCategories: {
    background: "white",
    borderRadius: "12px",
    padding: "10px",
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
  },
  sidebarTitle: {
    margin: "0 0 12px"
  },
  sideCategory: {
    textAlign: "left",
    padding: "11px 12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    whiteSpace: "nowrap"
  },
  content: {
    minWidth: 0
  },
  hero: {
    borderRadius: "16px",
    color: "white",
    display: "flex",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "0.5s ease"
  },
  badge: {
    background: "rgba(255,255,255,0.18)",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "13px"
  },
  heroTitle: {
    lineHeight: 1,
    maxWidth: "760px",
    margin: "18px 0"
  },
  heroText: {
    maxWidth: "640px",
    fontSize: "15px",
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
    fontWeight: "900"
  },
  dots: {
    display: "flex",
    gap: "8px",
    marginTop: "18px"
  },
  dot: {
    width: "34px",
    height: "6px",
    borderRadius: "999px",
    display: "inline-block"
  },
  flashDeals: {
    background: "white",
    borderRadius: "14px",
    padding: "14px",
    margin: "16px 0",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
  },
  flashTitle: {
    margin: 0,
    fontSize: "22px"
  },
  flashText: {
    color: "#6b7280",
    margin: "6px 0 16px"
  },
  flashGrid: {
    display: "grid",
    gap: "10px"
  },
  flashCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "10px",
    background: "#fff7ed"
  },
  flashImage: {
    width: "100%",
    height: "110px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "8px"
  },
  sectionHeader: {
    background: "white",
    borderRadius: "12px",
    padding: "16px",
    margin: "16px 0",
    display: "flex",
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
    display: "grid"
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
    objectFit: "cover",
    display: "block"
  },
  noImage: {
    height: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280"
  },
  discountBadge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    background: "#ef4444",
    color: "white",
    padding: "5px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    zIndex: 2
  },
  cardBody: {
    padding: "14px"
  },
  category: {
    margin: 0,
    color: "#f97316",
    fontWeight: "900",
    fontSize: "11px",
    textTransform: "uppercase"
  },
  productName: {
    margin: "8px 0",
    lineHeight: 1.25
  },
  rating: {
    color: "#f59e0b",
    fontSize: "12px",
    margin: "4px 0"
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#9ca3af",
    margin: "6px 0 0",
    fontSize: "13px"
  },
  price: {
    color: "#111827",
    fontWeight: "900",
    margin: "6px 0"
  },
  flashPrice: {
    color: "#f97316",
    fontWeight: "900",
    margin: "4px 0"
  },
  viewBtn: {
    width: "100%",
    marginTop: "8px",
    border: "1px solid #f97316",
    background: "white",
    color: "#f97316",
    borderRadius: "8px",
    padding: "10px",
    fontWeight: "900",
    cursor: "pointer"
  },
  addButton: {
    width: "100%",
    marginTop: "8px",
    border: "none",
    background: "#f97316",
    color: "white",
    borderRadius: "8px",
    padding: "11px",
    fontWeight: "900",
    cursor: "pointer"
  },
  trustSection: {
    margin: "24px 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px"
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
    padding: "16px"
  },
  modal: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    maxWidth: "420px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto"
  },
  modalImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "12px"
  },
  closeModalBtn: {
    width: "100%",
    marginTop: "10px",
    border: "none",
    background: "#111827",
    color: "white",
    borderRadius: "8px",
    padding: "11px",
    fontWeight: "900",
    cursor: "pointer"
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
    padding: "8px 12px"
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
    fontWeight: "900"
  },
  removeBtn: {
    padding: "8px 10px",
    border: "none",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#991b1b",
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
    fontWeight: "900",
    fontSize: "16px"
  },
  bottomNav: {
    display: window.innerWidth < 768 ? "grid" : "none",
    gridTemplateColumns: "repeat(3, 1fr)",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "white",
    borderTop: "1px solid #e5e7eb",
    boxShadow: "0 -6px 18px rgba(0,0,0,0.08)",
    zIndex: 999,
    padding: "8px"
  },
  bottomNavBtn: {
    border: "none",
    background: "transparent",
    fontWeight: "800",
    color: "#111827",
    padding: "10px 4px"
  },
  modalFlex: {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  maxWidth: "1100px",
  width: "95vw",
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: "24px",
  maxHeight: "90vh",
  overflowY: "auto"
},

modalLeft: {
  flex: 1
},

modalRight: {
  flex: 1
},

mainImage: {
  width: "100%",
  height: "420px",
  objectFit: "cover",
  borderRadius: "12px"
},

thumbnailRow: {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "8px",
  marginTop: "10px"
},

thumb: {
  width: "100%",
  height: "60px",
  objectFit: "cover",
  borderRadius: "8px",
  border: "2px solid #eee"
},
megaItemWrap: {
  position: "relative",
},

megaCategoryBtn: {
  width: "100%",
  border: "none",
  background: "white",
  color: "#111827",
  padding: "15px 12px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #f1f5f9",
},

megaPanel: {
  position: "fixed",
  left: "280px",
  top: "170px",
  width: "430px",
  maxHeight: "75vh",
  overflowY: "auto",
  background: "white",
  boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
  borderRadius: "0 14px 14px 0",
  padding: "20px",
  zIndex: 2000,
},

megaGroup: {
  marginBottom: "22px",
},

megaHeading: {
  margin: "0 0 12px",
  fontSize: "21px",
  fontWeight: "900",
  color: "#020617",
},

megaSubItem: {
  width: "100%",
  border: "none",
  background: "transparent",
  padding: "12px 10px",
  textAlign: "left",
  fontSize: "16px",
  color: "#1f2937",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},

mobileMegaPanel: {
  background: "#fff",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "inset 0 0 0 1px #e5e7eb",
},
};

export default Shop;