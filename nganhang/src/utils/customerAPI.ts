import axiosInstance from "./axiosConfig";

export const getCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customer");
    console.log("Response from getAllCustomers:", response);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all customers:", error.response);
    if (error.response.status === 403) {
      // chuyển đường dẫn
      window.location.href = "/";
    }
    throw error.response.data;
  }
};

export const postCustomer = async (customerData: any) => {
  try {
    const response = await axiosInstance.post("/api/customer", customerData);
    console.log("Response from postCustomer:", response.data);
    return response;
  } catch (error: any) {
    // console.error("Error posting customer:", error.response);
    throw error.response.data;
  }
};

export const putCustomer = async (customerData: any) => {
  try {
    const response = await axiosInstance.put("/api/customer", customerData);
    console.log("Response from putCustomer:", response.data);
    return response;
  } catch (error: any) {
    // console.error("Error updating customer:", error.response);
    throw error.response.data;
  }
};