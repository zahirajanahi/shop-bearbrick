import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { LogOut, Plus, FilePenLine, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import MultipleImageUpload from '../components/MultipleImageUpload';
import ImageCarousel from '../components/ImageCarousel';

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
    category: "figure",
    images: []
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      // Ensure images is always an array
      const processedData = data.map(product => ({
        ...product,
        images: product.images || (product.image_url ? [product.image_url] : [])
      }));
      
      setProducts(processedData);
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Error:", error);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const uploadImages = async (files) => {
    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
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
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      toast.error('Error uploading images');
      console.error('Error:', error);
      return [];
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

  const handleImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleFilesChange = (files) => {
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImages = [...formData.images];
      
      // Upload new files if any
      if (selectedFiles.length > 0) {
        const uploadedUrls = await uploadImages(selectedFiles);
        finalImages = [...finalImages, ...uploadedUrls];
      }

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: finalImages,
        // Keep image_url for backward compatibility (use first image)
        image_url: finalImages[0] || null
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);
        if (error) throw error;
        toast.success("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(
        editingProduct ? "Error updating product" : "Error creating product"
      );
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "figure",
      images: []
    });
    setSelectedFiles([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category || "figure",
      images: product.images || []
    });
    setSelectedFiles([]);
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="bg-white border border-zinc-300 w-full z-50 backdrop-blur-lg bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200 bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-900 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredProducts.length} Products
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                Product Management
              </h2>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-black hover:bg-gray-900 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-9 py-8 ">
                        <div className="w-20 h-20 mb-10">
                          <ImageCarousel
                            images={product.images || []}
                            alt={product.title}
                            className="w-20  h-28"
                            showThumbnails={false}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.price} MAD</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            <FilePenLine className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200"
                  >
                    <option value="figure">Figure</option>
                    <option value="tableau">Tableau</option>
                  </select>
                </div>
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
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200"
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
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all duration-200"
                />
              </div>
              
              <MultipleImageUpload
                images={formData.images}
                onImagesChange={handleImagesChange}
                onFilesChange={handleFilesChange}
                uploading={uploading}
                maxImages={5}
              />

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}