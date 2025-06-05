import axiosInstance from "./axiosConfig";

export const getAllStaff = async () => {
  try {
    const response = await axiosInstance.get("/api/staff");
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response.data;
  }
};

export const getAStaff = async () => {
  try {
    const response = await axiosInstance.get("/api/getAStaff");
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response.data;
  }
};

export const postStaff = async (staffData: any) => {
  try {
    const response = await axiosInstance.post("/api/staff", staffData);
    return response;
  } catch (error: any) {
    console.log(error)
    throw error.response.data;
  }
};

export const putStaff = async (staffData: any) => {
  try {
    const response = await axiosInstance.put("/api/staff", staffData);
    return response;
  } catch (error: any) {
    console.log(error)
    throw error.response.data;
  }
};