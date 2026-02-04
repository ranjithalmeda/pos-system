import { useEffect, useState } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from "./api/productApi";



function App() {
  const [products, setProducts] = useState([]);
 
  // <-- Add this here
  const [editingProduct, setEditingProduct] = useState(null);


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

  const [form, setForm] = useState({
  name: "",
  price: "",
  quantity: "",
});

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingProduct) {
      // Update product
      await updateProduct(editingProduct._id, form);
      setEditingProduct(null); // reset edit mode
    } else {
      // Add product
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
    await deleteProduct(id);  // Calls the API
    fetchProducts();           // Refresh the table
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

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
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <button className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
    </form>


      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.quantity}</td>
             <td className="p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => {
                    setForm({ name: p.name, price: p.price, quantity: p.quantity });
                    setEditingProduct(p);
                  }}
                >
                  Edit
                </button>
                <button                                                       // delete button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
