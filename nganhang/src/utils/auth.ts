import axiosInstance from "./axiosConfig";

// đăng nhập - giữ lại, bởi riêng login, trong axios config request không đính kèm access token
// Còn lại tất cả các API khác, đều sẽ được verify access token ở middleware backend trả lỗi 401
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
    }, {
      withCredentials: true,
    });
    const data = await res.data;
    console.log(data);
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
    return {
      access_token: null,
      success: false,
      message: "Something went wrong",
    };
  }
};
// Việc refresh hay verify access token đều được thực hiện ở middleware backend

// logout - giữ lại bởi nó sẽ xóa cả access token và refresh token
export const logout = async (): Promise<{
  success: boolean,
  message: string
}> => {
  try {
    const res = await axiosInstance.get('/api/auth/logout', {
      withCredentials: true
    });
    localStorage.removeItem('token');
    if (res.status == 200) {
      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    }
  } catch (error) {
    return {
      success: false, 
      message: 'Đăng xuất thất bại'
    };
  }
  return {
    success: false,
    message: 'Đăng xuất thất bại'
  };
};

export const verifyAuth = async (): Promise<boolean> => {
    try {
        const response = await axiosInstance.get('api/auth/verifyAccessToken');
        if (response.data.success) {
            return true;

        }
    } catch (error: any) {
        try {
            const refreshResponse = await axiosInstance.get('api/auth/refreshAccessToken');
            if (refreshResponse.data.success) {
                localStorage.setItem('access_token', refreshResponse.data.access_token);
                return true;
            } else {
                return false;
            }
        } catch (refreshError: any) {
            return false;
        }
    }
    return false;
}; 