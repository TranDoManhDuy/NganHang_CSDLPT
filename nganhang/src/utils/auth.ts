import axiosInstance from "./axiosConfig";

// đăng nhập
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

// refresh access token
export const refreshAccessToken = async (): Promise<{
  access_token: string | null;
  success: boolean;
  message: string;
}> => {
  try {
    const res = await axiosInstance.post("api/auth/refreshAccessToken", {}, {
      withCredentials: true,
    });
    const data = await res.data;

    if (res.status >= 200 && res.status < 300 && data.success) {
      return {
        access_token: data.access_token,
        success: true,
        message: "Token refreshed successfully"
      };
    } else {
      return {
        access_token: null,
        success: false,
        message: data.message || "Failed to refresh token"
      };
    }
  } catch (err) {
    console.log("Refresh token error:", err);
    return {
      access_token: null,
      success: false,
      message: "Something went wrong"
    };
  }
};

export const requireAuth = async (): Promise<boolean> => {
  // Lấy access token từ localStorage
  const tokenStr = localStorage.getItem('token');
  let accessToken: string | null = null;
  if (tokenStr) {
    try {
      const tokenObj = JSON.parse(tokenStr);
      accessToken = tokenObj.access_token;
    } catch (err) {
      console.error('Lỗi phân tích token từ localStorage:', err);
    }
  }
  if (!accessToken) {
    window.location.href = '/login';
    return false;
  }

  // Kiểm tra token hợp lệ
  try {
    const response = await axiosInstance.get('/api/auth/verifyAccessToken', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.warn('Token hết hạn hoặc không hợp lệ, đang thử refresh...');

    const refreshResult = await refreshAccessToken();
    
    if (refreshResult?.access_token) {
      // Lưu lại token mới theo đúng định dạng
      localStorage.setItem(
        'token',
        JSON.stringify({ access_token: refreshResult.access_token })
      );
      return true;
    } else {
      console.error('Refresh token thất bại');
      window.location.href = '/login';
      return false;
    }
  }
  window.location.href = '/login';
  return false;
};