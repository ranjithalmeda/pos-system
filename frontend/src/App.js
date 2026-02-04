import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./api/productApi";
import axios from "axios";
import { createSale } from "./api/saleApi";

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const [cart, setCart] = useState([]);

  // Fetch products on load
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
      // Remove deleted product from cart if exists
      setCart(cart.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Cart logic
  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
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

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // -------------------- CHECKOUT --------------------
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      // Save sale
      await axios.post("http://localhost:5000/api/sales", {
        items: cart,
        total: cartTotal,
        date: new Date(),
      });

      // Update stock for each product
      for (const item of cart) {
        const product = products.find((p) => p._id === item._id);
        const newQty = product.quantity - item.quantity;
        await updateProduct(item._id, { ...product, quantity: newQty });
      }

      // Clear cart and refresh products
      setCart([]);
      fetchProducts();
      alert("Checkout successful!");
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">POS System</h1>

      {/* PRODUCT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 flex gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Stock Qty"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <button className="bg-blue-600 text-white px-4 rounded">
          {editingProduct ? "Update" : "Add"}
        </button>
      </form>

      {/* PRODUCT TABLE */}
      <table className="w-full bg-white shadow rounded mb-8">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.quantity}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setForm({
                      name: p.name,
                      price: p.price,
                      quantity: p.quantity,
                    });
                    setEditingProduct(p);
                  }}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

            {/* ---------- CART ---------- */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Cart</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <>
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.price}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">{item.price * item.quantity}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          className="bg-gray-300 px-2 rounded"
                          onClick={() => {
                            setCart(
                              cart.map((c) =>
                                c._id === item._id && c.quantity > 1
                                  ? { ...c, quantity: c.quantity - 1 }
                                  : c
                              )
                            );
                          }}
                        >
                          −
                        </button>
                        <button
                          className="bg-gray-300 px-2 rounded"
                          onClick={() => {
                            setCart(
                              cart.map((c) =>
                                c._id === item._id
                                  ? { ...c, quantity: c.quantity + 1 }
                                  : c
                              )
                            );
                          }}
                        >
                          +
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 rounded"
                          onClick={() =>
                            setCart(cart.filter((c) => c._id !== item._id))
                          }
                        >
                          Remove
                        </button>
                        <button
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={async () => {
                              if (cart.length === 0) return alert("Cart is empty!");

                              try {
                                await createSale(cart);
                                alert("Checkout successful!");
                                setCart([]); // clear cart
                                fetchProducts(); // update product stock
                              } catch (error) {
                                console.error(error);
                                alert("Checkout failed!");
                              }
                            }}
                          >
                            Checkout
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="text-lg font-bold">
                Grand Total: Rs. {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
              </h3>

              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => alert("Checkout functionality coming next!")}
              >
                Checkout
              </button>
            </>
          )}
        </div>

    </div>
  );
}

export default App;
