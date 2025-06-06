import axiosInstance from "./axiosConfig";

export const getAllAccount = async () => {
  try {
    const response = await axiosInstance.get("/api/accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching all accounts:", error);
    throw error;
  }
};
export const postAccount = async (data: any) => {
  try {
    const response = await axiosInstance.post("/api/accounts", data);
    return response;
  } catch (error: any) {
    console.error("Error fetching all accounts:", error);

    throw error;
  }
};
