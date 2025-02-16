import React, { useState } from "react";
import { Link } from "react-router-dom"; // For navigation
import "./HomePage.css";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`home-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Header Section */}
      <header className="home-header">
        <div className="logo-container">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZshpmOEah8w622BNyoFl69rJiz8WgJaTBA&s"
            alt="Logo"
            className="logo"
          />
          <h1>🛍️ Web Scraping for Best Products</h1>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Main Content Section */}
      <section className="home-content">
        <h2>Our Web Scraping Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Dynamic Scraping</h3>
            <p>
              With our dynamic scraping feature, you can scrape product data in
              real-time from popular grocery websites such as BigBasket, Zepto,
              Swiggy, Blinkit, and more! This feature ensures you get the latest
              product prices, ratings, and availability.
            </p>
          </div>
          <div className="feature-card">
            <h3>Scheduled Scraping</h3>
            <p>
              Automate your scraping process by scheduling scraping tasks to run
              at regular intervals. Keep your product data fresh and up-to-date
              without manual intervention. You can set the frequency of scraping
              based on your needs—daily, weekly, or even hourly.
            </p>
          </div>
          <div className="feature-card">
            <h3>Data Visualization</h3>
            <p>
              Analyze the scraped data with visually appealing and interactive
              charts and graphs using Chart.js. Compare product prices, ratings,
              and discounts visually, making it easier to understand and make
              informed decisions when shopping for the best deals.
            </p>
          </div>
          <div className="feature-card">
            <h3>Best Product Recommendation</h3>
            <p>
              Our recommendation system helps you find the best products based
              on a variety of factors including price, ratings, and popularity.
              You can filter products according to your preferences, such as
              budget constraints or product categories, to make your shopping
              experience more personalized.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <Link to="/search">
            <button className="search-button">🔍 Search Products</button>
          </Link>
        </div>

        {/* Download Button */}
        <div className="download-container">
          <a
            href="http://example.com/path/to/your/datafile.zip"  // Replace with the actual file URL
            download
          >
            <button className="download-button">📥 Download Full Product Data</button>
          </a>
        </div>
      </section>

      {/* Features Explainer Section */}
      <section className="features-explainer">
        <h2>How It Works</h2>
        <p>
          Our web scraping tool works by extracting data from various grocery
          websites and presenting it in a structured format that is easy to
          analyze. Here's a quick breakdown of how it works:
        </p>
        <ul>
          <li><strong>1. Data Scraping:</strong> Scrape product details such as name, price, description, rating, and image from trusted websites.</li>
          <li><strong>2. Data Processing:</strong> Organize the scraped data in a usable format, such as CSV, JSON, or MongoDB for storage.</li>
          <li><strong>3. Data Visualization:</strong> Use Chart.js to visualize key metrics like price distribution, product ratings, and more.</li>
          <li><strong>4. Recommendations:</strong> Based on your search and preferences, we recommend the best products available across platforms.</li>
        </ul>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>🛒 Web Scraping App - Your Go-To Product Search Tool</p>
        <p>Created with ❤️ by Your Name</p>
        <p>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            Connect with us on LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
