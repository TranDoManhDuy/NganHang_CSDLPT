import axiosInstance from "./axiosConfig";
// export const getNewAccessToken = async (): Promise<string | null> => {
//   try {
//     const res = await fetch("http://localhost:5000/api/auth/refreshAccessToken", {
//       method: "POST",
//       credentials: "include",
//     });
//     const data = await res.json();
//     if (res.ok && data.access_token) {
//       localStorage.setItem(
//         "token",
//         JSON.stringify({ access_token: data.access_token })
//       );
//       return data.access_token;
//     } else {
//       return null;
//     }
//   } catch (err) {
//     console.error("Refresh token failed:", err);
//     return null;
//   }
// };

export const login = async (
  account_number: string,
  password: string,
  account_type: string
): Promise<{
  access_token: string | null;
  success: boolean;
  message: string;
}> => {
  try {
    const res = await axiosInstance.post("api/auth/login", {
      account_number,
      password,
      account_type,
    });

    const data = await res.data;

    if (res.status >= 200 && res.status < 300 && data.success) {
      return {
        access_token: data.access_token,
        success: true,
        message: "Login successful",
      };
    } else {
      return {
        access_token: null,
        success: false,
        message: data.message || "Login failed",
      };
    }
  } catch (err) {
    console.error("Login error:", err);
    return {
      access_token: null,
      success: false,
      message: "Something went wrong",
    };
  }
};
