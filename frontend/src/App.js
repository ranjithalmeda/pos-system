import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./api/productApi";
import { createSale } from "./api/saleApi";
import Dashboard from "./pages/Dashboard";
import POSPage from "./pages/POSPage";
import SalesPage from "./pages/SalesPage";

function App() {
  const [page, setPage] = useState("POS"); // "POS", "Sales", "Dashboard"
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [cart, setCart] = useState([]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, form);
        setEditingProduct(null);
      } else {
        await addProduct(form);
      }

      setForm({ name: "", price: "", quantity: "" });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
      setCart(cart.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Cart logic
  const addToCart = (product) => {
    if (product.quantity === 0) return;

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      if (existing.quantity >= product.quantity) {
        alert("Not enough stock available!");
        return;
      }

      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const updateCartQuantity = (id, newQuantity) => {
    const product = products.find((p) => p._id === id);
    
    if (!product) return;
    
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (newQuantity > product.quantity) {
      alert("Not enough stock available!");
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    console.log("Cart being sent:", cart);

    try {
      await createSale(cart);
      alert("Checkout successful!");
      setCart([]);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Checkout failed!");
    }
  };

  return (
    <div className="p-4">
      <nav className="flex space-x-4 mb-4">
        <button onClick={() => setPage("Dashboard")} className="btn">
          Dashboard
        </button>
        <button onClick={() => setPage("POS")} className="btn">
          POS
        </button>
        <button onClick={() => setPage("Sales")} className="btn">
          Sales History
        </button>
      </nav>

      {page === "Dashboard" && <Dashboard />}
      {page === "POS" && (
        <POSPage
          products={products}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          handleCheckout={handleCheckout}
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          setForm={setForm}
        />
      )}
      {page === "Sales" && <SalesPage />}
    </div>
  );
}

export default App;
