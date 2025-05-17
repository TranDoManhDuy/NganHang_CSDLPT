import axiosInstance from "./axiosConfig";

export const getBranches = async () => {
  try {
    const response = await axiosInstance.get("/api/branches");
    console.log("Response from getAllBranches:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all branches:", error);
    throw error;
  }
};