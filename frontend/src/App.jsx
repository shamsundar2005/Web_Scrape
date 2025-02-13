import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
            setProducts(response.data); // Store fetched data in state
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
                        <div key={product._id} className="product-card">
                            <h2>{product.product_name}</h2>
                            <p><strong>Brand:</strong> {product.brand}</p>
                            <p><strong>Price:</strong> {product.price}</p>
                            <p><strong>MRP:</strong> {product.mrp}</p>
                            <img src={product.image_url} alt={product.product_name} />
                            <a href={product.link} target="_blank" rel="noopener noreferrer">View Product</a>
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
