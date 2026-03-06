import React from "react";

const POSPage = ({
  products,
  cart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  handleCheckout,
  form,
  handleChange,
  handleSubmit,
  handleDelete,
  editingProduct,
  setEditingProduct,
  setForm,
}) => {
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
                  disabled={p.quantity === 0}
                  className={`px-3 py-1 rounded ${
                    p.quantity === 0
                      ? "bg-gray-400"
                      : "bg-green-600 text-white"
                  }`}
                  onClick={() => addToCart(p)}
                >
                  {p.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CART */}
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
                {cart.map((item) => {
                  const product = products.find((p) => p._id === item._id);

                  return (
                    <tr key={item._id} className="border-t">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.price}</td>

                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          max={product?.quantity}
                          value={item.quantity}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            updateCartQuantity(item._id, value);
                          }}
                          className="border p-1 w-16 text-center"
                        />
                      </td>

                      <td className="p-2">
                        {item.price * item.quantity}
                      </td>

                      <td className="p-2">
                        <button
                          className="bg-red-600 text-white px-2 rounded"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h3 className="text-lg font-bold">
              Grand Total: Rs. {cartTotal}
            </h3>

            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default POSPage;
