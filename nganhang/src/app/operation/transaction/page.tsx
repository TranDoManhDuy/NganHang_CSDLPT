"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import { NavItem } from "@/components/NavItem";
import { SecondaryNavItem } from "@/components/SecondaryNavItem";
import axiosInstance from "@/utils/axiosConfig";

interface AccountDetails {
  SOTK: string;
  CMND: string;
  SODU: number;
  MACN: string;
  NGAYMOTK: string;
  HOTEN?: string;
}

export default function TransferNavbars() {
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [employeeId, setEmployeeId] = useState(""); // Added for MANV
  const [senderDetails, setSenderDetails] = useState<AccountDetails | null>(null);
  const [receiverDetails, setReceiverDetails] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handSecondaryNavItemClick = (path: string) => {
    location.href = path;
  };

  // Hàm kiểm tra thông tin tài khoản
  const validateAccount = async (account: string, type: "sender" | "receiver") => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.get(`/api/accounts/${account}`);
      const data = response.data;

      if (response.status === 200 && data.data) {
        if (type === "sender") {
          setSenderDetails(data.data);
        } else {
          setReceiverDetails(data.data);
        }
      } else {
        setError(data.error || "Số tài khoản không hợp lệ");
        if (type === "sender") {
          setSenderDetails(null);
        } else {
          setReceiverDetails(null);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Đã có lỗi xảy ra khi kiểm tra tài khoản");
      if (type === "sender") {
        setSenderDetails(null);
      } else {
        setReceiverDetails(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chuyển tiền
  const handleTransfer = async () => {
    if (!senderDetails || !receiverDetails) {
      setError("Vui lòng nhập số tài khoản hợp lệ cho cả người gửi và người nhận");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (Number(amount) < 100000) {
      setError("Số tiền phải lớn hơn hoặc bằng 100,000 VND");
      return;
    }
    if (Number(amount) > senderDetails.SODU) {
      setError("Số dư không đủ");
      return;
    }
    if (senderDetails.SOTK === receiverDetails.SOTK) {
      setError("Tài khoản người gửi và người nhận không được trùng nhau");
      return;
    }
    if (!employeeId) {
      setError("Vui lòng nhập mã nhân viên");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(`/api/transfer-money`, {
        SOTK_CHUYEN: senderDetails.SOTK,
        SOTK_NHAN: receiverDetails.SOTK,
        SOTIEN: Number(amount),
        MANV: employeeId,
      });

      if (response.status === 200) {
        setSuccess(`Chuyển tiền thành công: ${Number(amount).toLocaleString()} VND`);
        setAmount("");
        setEmployeeId("");
        setSenderDetails((prev) =>
          prev
            ? {
                ...prev,
                SODU: prev.SODU - Number(amount),
              }
            : null
        );
      } else {
        setError("Chuyển tiền thất bại");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Chuyển tiền thất bại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra tài khoản khi số tài khoản thay đổi
  useEffect(() => {
    if (senderAccount) {
      const timeout = setTimeout(() => {
        validateAccount(senderAccount, "sender");
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setSenderDetails(null);
      setError("");
      setSuccess("");
    }
  }, [senderAccount]);

  useEffect(() => {
    if (receiverAccount) {
      const timeout = setTimeout(() => {
        validateAccount(receiverAccount, "receiver");
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setReceiverDetails(null);
      setError("");
      setSuccess("");
    }
  }, [receiverAccount]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ bgcolor: "#4e6d9c" }}>
        <Toolbar variant="dense" disableGutters>
          <NavItem handleClick={() => handSecondaryNavItemClick("/management/customers")}>
            Quản lý
          </NavItem>
          <NavItem handleClick={() => handSecondaryNavItemClick("/operation/deposit_withdrawal")} active>
            Nghiệp vụ
          </NavItem>
          <NavItem handleClick={() => handSecondaryNavItemClick("/statistic/account")}>Thống kê</NavItem>
        </Toolbar>
      </AppBar>

      {/* Secondary Navigation */}
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #d0d0d0",
          bgcolor: "#fafafa",
        }}
      >
        <SecondaryNavItem
          icon={<AccountBalanceIcon />}
          label="Gửi rút"
          onClick={() => handSecondaryNavItemClick("/operation/deposit_withdrawal")}
        />
        <SecondaryNavItem
          icon={<GroupIcon />}
          label="Chuyển tiền"
          active
          onClick={() => handSecondaryNavItemClick("/operation/transfer")}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Chuyển Tiền
          </Typography>

          {/* Sender Account Input */}
          <TextField
            fullWidth
            label="Số tài khoản người gửi"
            value={senderAccount}
            onChange={(e) => setSenderAccount(e.target.value)}
            margin="normal"
            disabled={loading}
            inputProps={{ maxLength: 9 }}
          />

          {/* Sender Account Details */}
          {senderDetails && !loading && (
            <Box sx={{ mt: 2, mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography>
                <strong>Số tài khoản:</strong> {senderDetails.SOTK}
              </Typography>
              <Typography>
                <strong>CMND:</strong> {senderDetails.CMND}
              </Typography>
              <Typography>
                <strong>Số dư:</strong> {senderDetails.SODU.toLocaleString()} VND
              </Typography>
              <Typography>
                <strong>Chi nhánh:</strong> {senderDetails.MACN}
              </Typography>
              <Typography>
                <strong>Ngày mở TK:</strong>{" "}
                {new Date(senderDetails.NGAYMOTK).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {/* Receiver Account Input */}
          <TextField
            fullWidth
            label="Số tài khoản người nhận"
            value={receiverAccount}
            onChange={(e) => setReceiverAccount(e.target.value)}
            margin="normal"
            disabled={loading}
            inputProps={{ maxLength: 9 }}
          />

          {/* Receiver Account Details */}
          {receiverDetails && !loading && (
            <Box sx={{ mt: 2, mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography>
                <strong>Số tài khoản:</strong> {receiverDetails.SOTK}
              </Typography>
              <Typography>
                <strong>Họ tên:</strong> {receiverDetails.HOTEN || "Không có thông tin"}
              </Typography>
              <Typography>
                <strong>Chi nhánh:</strong> {receiverDetails.MACN}
              </Typography>
            </Box>
          )}

          {/* Employee ID Input */}
          <TextField
            fullWidth
            label="Mã nhân viên"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            margin="normal"
            disabled={loading}
          />

          {/* Amount Input */}
          <TextField
            fullWidth
            label="Số tiền (VND)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            type="number"
            inputProps={{ min: 100000 }}
            disabled={loading || !senderDetails || !receiverDetails}
          />

          {/* Loading Indicator */}
          {loading && <CircularProgress size={24} sx={{ my: 2 }} />}

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          {/* Action Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTransfer}
              disabled={loading || !senderDetails || !receiverDetails || !employeeId}
              fullWidth
            >
              Xác nhận chuyển tiền
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}