import axiosInstance from "./axiosConfig";

export const getBranches = async () => {
  try {
    const response = await axiosInstance.get("/api/branches");
    return response.data;
  } catch (error) {
    console.error("Error fetching all branches:", error);
    throw error;
  }
};