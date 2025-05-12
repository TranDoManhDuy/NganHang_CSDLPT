import axiosInstance from "./axiosConfig";

export const getAllAccount = async () => {
  try {
    const response = await axiosInstance.get("/api/accounts");
    console.log("Response from getAllAccount:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all accounts:", error);
    throw error;
  }
};
