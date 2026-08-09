import ApiClient from "../helpers/ApiClient"; // Uses configured ApiClient with Bearer headers
import { toast } from "react-toastify";

const OrderServices = {
  /**
   * Create a new order (Checkout)
   * Route: POST /create-order
   */
  async createOrder(orderData) {
    try {
      const response = await ApiClient.post("/create-order", orderData);

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      toast.success(response.data?.message || "Order placed successfully!");
      return response.data?.data;
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create order";
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Fetch all orders with pagination support
   * Route: GET /get-all-orders?skip=0&limit=50
   */
  async getAllOrders(skip = 0, limit = 50) {
    try {
      const response = await ApiClient.get("/get-all-orders", {
        params: { skip, limit },
      });

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      // Returns payload: { total_count, retrieved_count, skip, limit, orders: [...] }
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch orders";
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Fetch a single order by ID
   * Route: GET /get-orders/{order_id}
   */
  async getOrderById(orderId) {
    try {
      const response = await ApiClient.get(`/get-orders/${orderId}`);

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      return response.data?.data;
    } catch (error) {
      console.error(`Error fetching order #${orderId}:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||

        error.message ||
        "Failed to fetch order details";
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update order status (e.g., Pending, Processing, Shipped, Delivered, Cancelled)
   * Route: PATCH /order-status/{order_id}
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await ApiClient.patch(`/order-status/${orderId}`, {
        status: status,
      });

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      toast.success(response.data?.message || `Order #${orderId} status updated!`);
      return response.data?.data;
    } catch (error) {
      console.error(`Error updating order #${orderId} status:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||

        error.message ||
        "Failed to update order status";
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete order by ID (Requires auth, allowed only if status is 'Delivered' or 'Cancelled')
   * Route: DELETE /{order_id}
   */
  async deleteOrder(orderId) {
    try {
      const response = await ApiClient.delete(`/${orderId}`);

      if (response.data?.error) {
        toast.error(response.data.error);
        throw new Error(response.data.error);
      }

      toast.success(response.data?.message || `Order #${orderId} deleted successfully!`);
      return response.data?.data;
    } catch (error) {
      console.error(`Error deleting order #${orderId}:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||

        error.message ||
        "Failed to delete order";
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default OrderServices;