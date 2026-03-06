import React, { useState, useEffect } from "react";
import { getSales } from "../api/saleApi";

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);

      const response = await getSales();   // ✅ FIXED HERE

      setSales(response.data.reverse());
    } catch (err) {
      setError("Failed to fetch sales.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading sales...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sales History</h2>

      <div className="overflow-auto max-h-[400px]">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Items Sold</th>
              <th className="px-4 py-2 border">Quantities</th>
              <th className="px-4 py-2 border">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {new Date(sale.createdAt).toLocaleString()}
                </td>

                <td className="px-4 py-2 border">
                  {sale.products && sale.products.length > 0
                    ? sale.products.map(item => item.name).join(", ")
                    : "N/A"}
                </td>

                <td className="px-4 py-2 border">
                  {sale.products && sale.products.length > 0
                    ? sale.products.map(item => item.quantity).join(", ")
                    : "N/A"}
                </td>

                <td className="px-4 py-2 border">
                  Rs. {sale.total ? sale.total.toFixed(2) : "0.00"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default SalesPage;