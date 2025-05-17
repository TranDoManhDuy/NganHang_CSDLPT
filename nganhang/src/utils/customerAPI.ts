import axiosInstance from "./axiosConfig";

export const getCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customer");
    console.log("Response from getAllCustomers:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all customers:", error);
    throw error;
  }
};