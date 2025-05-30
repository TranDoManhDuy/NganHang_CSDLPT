import axiosInstance from "./axiosConfig";

export const testRequest = async () => {
    try {
      const response = await axiosInstance.get("/api/test");
      console.log("Response from getALL NV:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all NV:", error);
      throw error;
    }
  };