import axiosInstance from "./axiosConfig";

export const getCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customer");
    return response.data;
  } catch (error: any) {
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
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const putCustomer = async (customerData: any) => {
  try {
    const response = await axiosInstance.put("/api/customer", customerData);
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};