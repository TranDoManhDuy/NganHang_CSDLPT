import axiosInstance from "./axiosConfig";

export const getAllStaff = async () => {
    try {
      const response = await axiosInstance.get("/api/staff");
      return response.data;
    } catch (error: any) {
      if (error.response.status === 403) {
        console.log(error)
      }
      throw error.response.data;
    }
  };