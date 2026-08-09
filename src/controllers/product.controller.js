import ApiClient from "../helpers/ApiClient"; // Uses your configured ApiClient with Bearer headers
import { toast } from "react-toastify";

const ProductServices = {
 
  getAllProducts: async () => {
    try {
      const response = await ApiClient.get("/all-products");
      const rawData = response.data?.data || [];

      // Encode image URLs to handle spaces and special characters safely
      return rawData.map((product) => ({
        ...product,
        image_url: product.image_url ? encodeURI(product.image_url) : null,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      const errorMessage =
      error.response?.data?.message ||
        error.response?.data?.error ||
        
        error.message ||
        "Failed to fetch products";
      toast.error(errorMessage);
      throw error;
    }
  },


  getProductById: async (product_id) => {
    try {
      const response = await ApiClient.get(`/products/${product_id}`);
      const product = response.data?.data;
      if (product && product.image_url) {
        product.image_url = encodeURI(product.image_url);
      }
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
      
        error.message ||
        "Failed to fetch product details";
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Create a new product (Multipart Form Data with Image File)
   * @param {Object} productData - { name, description, price, stock, category }
   * @param {File} file - Selected image file object
   */
  createProduct: async (productData, file) => {
    try {
      const formData = new FormData();

      // Append text/number fields
      formData.append("name", productData.name);
      formData.append("description", productData.description || "");
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category || "");

      // Append file
      if (file) {
        formData.append("file", file);
      }

      const response = await ApiClient.post("/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      toast.success(response.data?.message || "Product created successfully!");
      return response.data?.data;
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to create product";
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update an existing product
   * @param {number|string} product_id - Product ID to update
   * @param {Object} productData - { name, description, price, stock, category, is_active }
   * @param {File|null} file - Optional new image file
   */
  updateProduct: async (product_id, productData, file = null) => {
    try {
      const formData = new FormData();

      // Append updated fields
      if (productData.name) formData.append("name", productData.name);
      if (productData.description !== undefined)
        formData.append("description", productData.description);
      if (productData.price !== undefined)
        formData.append("price", productData.price);
      if (productData.stock !== undefined)
        formData.append("stock", productData.stock);
      if (productData.category !== undefined)
        formData.append("category", productData.category);
      if (productData.is_active !== undefined)
        formData.append("is_active", productData.is_active);

      // Append file if a new one was selected
      if (file) {
        formData.append("file", file);
      }

      const response = await ApiClient.put(`/update-product/${product_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      toast.success(response.data?.message || "Product updated successfully!");
      return response.data?.data;
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to update product";
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete a product by ID
   * @param {number|string} product_id
   */
  deleteProduct: async (product_id) => {
    try {
      const response = await ApiClient.delete(`/delete-product/${product_id}`);

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      toast.success(response.data?.message || "Product deleted successfully!");
      return response.data?.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to delete product";
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default ProductServices;