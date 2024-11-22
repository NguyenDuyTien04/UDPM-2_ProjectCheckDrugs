import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Collection.css";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const token = localStorage.getItem("token");

  // Fetch danh sách Collection
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/collections/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error.response?.data || error.message);
      }
    };

    fetchCollections();
  }, [token]);

  // Xử lý tạo mới Collection
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/collections/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      alert("Collection created successfully!");
      setCollections([...collections, response.data.data]); // Cập nhật danh sách
      setFormData({ name: "", description: "", imageUrl: "" });
    } catch (error) {
      console.error("Error creating collection:", error.response?.data || error.message);
      alert("Failed to create collection.");
    }
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h1>Manage Collections</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Collection Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Collection</button>
      </form>

      <h2>Your Collections</h2>
      <ul>
        {collections.map((collection) => (
          <li key={collection._id}>
            <strong>{collection.name}</strong>: {collection.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Collection;
