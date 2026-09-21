import {
  ShieldCheck,
  Truck,
  Headphones,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      text: "Your shopping experience is designed with security and simplicity in mind.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      text: "Get your orders delivered safely and conveniently.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      text: "We're here to help whenever you need us.",
    },
    {
      icon: ShoppingBag,
      title: "Quality Products",
      text: "Discover products selected to give you a great shopping experience.",
    },
  ];

  return (
    <main className="about-page">

      <section className="about-hero">
        <span className="section-label">ABOUT US</span>

        <h1>
          Everything you need,
          <br />
          in one place.
        </h1>

        <p>
          We built our store to make online shopping simple,
          convenient, and enjoyable.
        </p>
      </section>

      <section className="about-story">

        <div className="about-story-content">
          <span className="section-label">
            OUR STORY
          </span>

          <h2>
            A better way to shop online.
          </h2>

          <p>
            Our platform brings products, shopping,
            wishlist, cart, and order management together
            in one simple experience.
          </p>

          <p>
            Whether you're browsing products or completing
            an order, our goal is to keep everything clear,
            fast, and easy to use.
          </p>

          <Link to="/products" className="about-button">
            Explore Products
          </Link>
        </div>

        <div className="about-story-visual">
          <div className="about-visual-card">
            <ShoppingBag size={55} />
            <span>Simple. Modern. Convenient.</span>
          </div>
        </div>

      </section>

      <section className="about-features">

        <div className="about-features-header">
          <span className="section-label">
            WHY CHOOSE US
          </span>

          <h2>
            Built around your shopping experience.
          </h2>
        </div>

        <div className="about-features-grid">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="about-feature"
                key={feature.title}
              >
                <div className="about-feature-icon">
                  <Icon size={24} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </article>
            );
          })}

        </div>

      </section>

    </main>
  );
}

export default About;