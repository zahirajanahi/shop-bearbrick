import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Plus, FilePenLine, X, Upload } from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productsPerPage = 5;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, products]);
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Error:", error);
    }
  };
  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  const uploadImage = async (file) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) return;
        imageUrl = uploadedUrl;
      }
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            image_url: imageUrl,
          })
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            image_url: imageUrl,
          },
        ]);
        if (error) throw error;
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ title: "", description: "", price: "", image_url: "" });
      setImageFile(null);
      setPreviewUrl("");
      fetchProducts();
    } catch (error) {
      toast.error(
        editingProduct ? "Error updating product" : "Error creating product"
      );
      console.error("Error:", error);
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
    });
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Error deleting product");
        console.error("Error:", error);
      }
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Error:", error);
    }
  };
  const isValidImageUrl = (url) => {
    if (!url) return false;
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null ||
      url.startsWith("https://images.unsplash.com") ||
      url.startsWith("https://via.placeholder.com")
    );
  };
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center border rounded-3xl w-80 focus-within:border-indigo-500 transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[38px] overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for products"
                  className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 30 30"
                  fill="#6B7280"
                >
                  <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                </svg>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-3xl text-sm leading-4 font-medium text-white bg-black hover:bg-zinc-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl ps-5 font-bold text-slate-800">
              List of products ({filteredProducts.length} total)
            </h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  title: "",
                  description: "",
                  price: "",
                  image_url: "",
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-500 text-sm font-medium rounded-md text-gray-800 bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2 text-black" />
              Add Product
            </button>
          </div>
          <div className="overflow-x-auto bg-white shadow-md rounded-md">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-zinc-400/10">
                <tr>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gray-300">
                    <td className="px-4 py-2">
                      <img
                        src={product.image_url || "https://via.placeholder.com/150?text=No+Image"}
                        alt={product.title}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="px-4 py-2">{product.title}</td>
                    <td className="px-4 py-2">{product.description}</td>
                    <td className="px-4 py-2 font-medium">{product.price} MAD </td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-blue-900 hover:underline mr-2"
                      >
                        <FilePenLine className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-800 hover:underline"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-10 p-4 ">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {(previewUrl || formData.image_url) && (
                      <img
                        src={previewUrl || formData.image_url}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150?text=Invalid+Image";
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload Image"}
                      </label>
                    </div>
                    {!imageFile && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Or paste an image URL:
                        </p>
                        <input
                          type="url"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    setImageFile(null);
                    setPreviewUrl("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}