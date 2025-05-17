import { connectDB } from "../config/database";
export const executeQuery = async (query: string, params: any[]) => {
  try {
    const pool = await connectDB();
    const request = pool.request();
    params.forEach((param) => {
      request.input(param.name, param.type, param.value);
    });
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
