import axios from "axios";

const API_URL = "http://localhost:3000/api/trains";

export const fetchTrains = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
