import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (query) {
                handleSearch();
            }
        }, 500); // Debounced API calls
        return () => clearTimeout(delaySearch);
    }, [query]);

    const handleSearch = async () => {
        if (!query.trim()) return; // Avoid empty queries
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false);
    };

    // Sorting best deals based on highest discount
    const bestDeals = [...products]
        .filter((p) => p.discount)
        .sort((a, b) => parseFloat(b.discount) - parseFloat(a.discount))
        .slice(0, 5); // Get top 5 products with the highest discount

    // Calculate price per gram for products
    const productsWithPricePerGram = products.map((product) => {
        const quantityInGrams = parseFloat(product.quantity) || 1; // Default to 1 gram if quantity is missing
        const pricePerGram = (parseFloat(product.price) / quantityInGrams).toFixed(2);
        return { ...product, pricePerGram };
    });

    // Get top 5 products based on price per gram
    const top5Products = [...productsWithPricePerGram]
        .sort((a, b) => a.pricePerGram - b.pricePerGram)
        .slice(0, 5);

    // Chart Data for Price Per Gram
    const pricePerGramChartData = {
        labels: top5Products.map((p) => p.name),
        datasets: [
            {
                label: "Price Per Gram (₹)",
                data: top5Products.map((p) => p.pricePerGram),
                backgroundColor: "#36a2eb",
                borderColor: "#36a2eb",
                borderWidth: 1,
            },
        ],
    };

    // Sort products: products with image first, others at last
    const sortedProducts = [...products].sort((a, b) => {
        const aHasImage = a.image && a.image.trim() !== "";
        const bHasImage = b.image && b.image.trim() !== "";
        return bHasImage - aHasImage; // Sort in descending order: products with images first
    });

    return (
        <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
            <header className="header">
                <div className="logo-container">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZshpmOEah8w622BNyoFl69rJiz8WgJaTBA&s" alt="Logo" className="logo" />
                    <h1>🛍️ Product Search</h1>
                </div>
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </button>
            </header>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="🔍 Search for a product..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* 🔄 Loading Spinner */}
            {loading && <div className="spinner"></div>}

            <div className="best-deals">
    <h2>🏆 Best Deals</h2>
    <div className="best-deals-list">
        {bestDeals.length > 0 ? (
            bestDeals.map((product) => (
                <div
                    key={product._id || product.id}
                    className={`product-card ${product.discount >= 50 ? "high-discount" : ""}`}
                >
                    <div className="discount-badge">🔥 {product.discount}% OFF</div>
                    <img
                        src={product.image || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="product-image"
                    />
                    <h3>{product.name}</h3>
                    <p><strong>Price:</strong> ₹{product.price}</p>
                    <p className="discount-text"><strong>Discount:</strong> {product.discount}%</p>
                </div>
            ))
        ) : (
            <p className="no-deals">No best deals found</p>
        )}
    </div>
</div>


            {/* 📊 Price Per Gram Comparison */}
            <div className="chart-and-recommendation">
                <div className="chart-container">
                    <h2>📊 Price Per Gram Comparison</h2>
                    <Bar
                        data={pricePerGramChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: "Price Per Gram (₹)",
                                    },
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: "Product",
                                    },
                                },
                            },
                        }}
                    />
                </div>

                {/* 🏆 Recommended Products */}
                <div className="recommended-products">
                    <h2>🏆 Recommended Products</h2>
                    <div className="recommended-list">
                        {top5Products.map((product) => (
                            <div key={product._id || product.id} className="product-card">
                                <img
                                    src={product.image || "https://via.placeholder.com/150"}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <h3>{product.name}</h3>
                                <p><strong>Price:</strong> ₹{product.price}</p>
                                <p><strong>Price Per Gram:</strong> ₹{product.pricePerGram}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 📦 Product List */}
            <div className="product-list">
                {!loading && sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                        <div key={product._id || product.id} className="product-card">
                            <img
                                src={product.image || "https://img.freepik.com/premium-vector/out-stock-red-background-line-icon-auction-real-estate-valuable-sell-profitable-vector-icon-business-advertising_727385-7484.jpg"}
                                alt={product.name || "Product Image"}
                                className="product-image"
                            />
                            <h2>{product.name}</h2>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><strong>Brand:</strong> {product.Label}</p>
                            <p><strong>Rating:</strong> ⭐ {product.Label1} ({product.Label3})</p>

                            {/* 💰 Price & MRP */}
                            <p className="price">
                                <strong>Price:</strong> ₹{product.price} 
                                <del> ₹{product.mrp}</del>
                            </p>

                            {/* 🎉 Discount & Offers */}
                            {product.discount && <p className="offers">🔥 {product.discount}</p>}
                            {product.Label4 && <p><strong>Other Variants:</strong> {product.Label4}</p>}
                            {product.Field11 && <p><strong>Discount Name:</strong> {product.Field11}</p>}

                            
                        </div>
                    ))
                ) : (
                    !loading && <p className="no-products">No products found</p>
                )}
            </div>
        </div>
    );
}

export default App;
