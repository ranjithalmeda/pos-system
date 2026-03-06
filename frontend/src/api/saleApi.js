import axios from "axios";

const API_URL = "http://localhost:5000/api/sales";

export const createSale = async (cart) => {
  return axios.post(API_URL, { items: cart });
};

export const getSales = async () => {
  return axios.get(API_URL);
};