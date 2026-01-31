import "./Shop.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Shop() {

  const categories = [
    { name: "Whey Protein",  img: "https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Creatine",  img: "https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Mass Gainer", img: "https://images.unsplash.com/photo-1693996046865-19217d179161?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Accessories", img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80" },
    { name: "Gym Clothing", img: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&q=80" },
  ];

  const bestSellers = [
    {
      name: "Premium Whey Protein",
      price: 3500,
      img: "https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Creatine Monohydrate",
      price: 2000,
      img: "https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Pre Workout",
      price: 2500,
      img: "https://images.unsplash.com/photo-1704650311162-153bbf7f17b0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div className="shop-hero">

        <img
          src="https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Creatine Supplement"
          className="hero-img"
        />

        <div className="hero-overlay">
          <h1>Fuel Your Fitness</h1>
          
        </div>

      </div>

      {/* CATEGORIES */}
      <section className="shop-section">
        <h2>Shop By Category</h2>

        <div className="category-grid">
          {categories.map((cat, i) => (
            <div className="category-card" key={i}>
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="shop-section">
        <h2>Best Sellers</h2>

        <div className="product-grid">
          {bestSellers.map((item, index) => (
            <div className="product-card" key={index}>
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <p>Rs. {item.price}</p>
              <button>Add To Cart</button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
