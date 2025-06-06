import axiosInstance from "./axiosConfig";

export const getCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customer");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const postCustomer = async (customerData: any) => {
  try {
    const response = await axiosInstance.post("/api/customer", customerData);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const putCustomer = async (customerData: any) => {
  try {
    const response = await axiosInstance.put("/api/customer", customerData);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const deleteCustomer = async (cmnd: string) => {
  try {
    const data: any = {
      CMND: cmnd,
    };
    const response = await axiosInstance.delete("/api/customer", {
      data: data, // axios delete method requires data to be passed in the body
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};
