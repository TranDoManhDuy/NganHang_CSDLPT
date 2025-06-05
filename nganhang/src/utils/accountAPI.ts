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
export const postAccount = async (data: any) => {
  try {
    const response = await axiosInstance.post("/api/accounts", data);
    console.log("Response from postAccount:", response.data);
    if (response.status !== 200) {
      throw new Error("Failed to create account");
    }
    if (response.status === 200) {
      alert("Tạo tài khoản thành công");
    }
    return response.data;
  } catch (error) {
    console.error("Error posting account:", error);
    throw error;
  }
};