import axios from "axios";

const API_URL = "http://localhost:3000/api/users"; // Backend endpoint

// Fetch all users
export const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    throw err;
  }
};

// Add new user
export const addUser = async (user) => {
  try {
    const res = await axios.post(API_URL, user);
    return res.data;
  } catch (err) {
    console.error("Error adding user:", err);
    throw err;
  }
};

// Update existing user
export const updateUser = async (id, user) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, user);
    return res.data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};
