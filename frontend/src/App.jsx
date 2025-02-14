import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    return (
        <div className="app">
            <h1>Product Search</h1>
            <input
                type="text"
                placeholder="Search for a product..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            {/* Display product list */}
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id || product.id} className="product-card">
                            <h2>{product.name || product.Title}</h2>
                            <p><strong>Brand:</strong> {product.brand || product.Label}</p>
                            <p><strong>Price:</strong> {product.price || product.Field9}</p>
                            {product["coupons and offers"] && <p><strong>Coupons & Offers:</strong> {product["coupons and offers"]}</p>}
                            {product.Image && <img src={product.Image} alt={product.Title} />}
                            {product["image-src"] && <img src={product["image-src"]} alt={product.name} />}
                            <a href={product["link-href"] || product.Title_URL} target="_blank" rel="noopener noreferrer">View Product</a>
                            
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
}

export default App;
