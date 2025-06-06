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
import axiosInstance from "@/utils/axiosConfig"; // Import the axios instance

interface AccountDetails {
  SOTK: string;
  CMND: string;
  SODU: number;
  MACN: string;
  NGAYMOTK: string;
}

export default function DepositWithdrawalNavbars() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handSecondaryNavItemClick = (path: string) => {
    location.href = path;
  };

  // Fetch account details from API using axiosInstance
  const validateAccount = async (account: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.get(`/api/accounts/${account}`);
      const data = response.data;

      if (response.status === 200 && data.data) {
        setAccountDetails(data.data);
      } else {
        setError(data.error || "Số tài khoản không hợp lệ");
        setAccountDetails(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Đã có lỗi xảy ra khi kiểm tra tài khoản");
      setAccountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle deposit and withdrawal action (combined)
  const handleTransaction = async (transactionType: "GT" | "RT") => {
    if (!accountDetails) {
      setError("Vui lòng nhập số tài khoản hợp lệ");
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
    if (transactionType === "RT" && Number(amount) > accountDetails.SODU) {
      setError("Số dư không đủ");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(`/api/deposit-withdrawal`, {
        SOTK: accountDetails.SOTK,
        LOAIGD: transactionType,
        SOTIEN: Number(amount),
      });

      if (response.status === 200) {
        const action = transactionType === "GT" ? "Gửi tiền" : "Rút tiền";
        setSuccess(`${action} thành công: ${Number(amount).toLocaleString()} VND`);
        setAmount("");
        setAccountDetails((prev) =>
          prev
            ? {
                ...prev,
                SODU:
                  transactionType === "GT"
                    ? prev.SODU + Number(amount)
                    : prev.SODU - Number(amount),
              }
            : null
        );
      } else {
        setError(`${transactionType === "GT" ? "Gửi tiền" : "Rút tiền"} thất bại`);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || `${transactionType === "GT" ? "Gửi tiền" : "Rút tiền"} thất bại`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Validate account number when it changes
  useEffect(() => {
    if (accountNumber) {
      const timeout = setTimeout(() => {
        validateAccount(accountNumber);
      }, 500); // Debounce API call
      return () => clearTimeout(timeout);
    } else {
      setAccountDetails(null);
      setError("");
      setSuccess("");
    }
  }, [accountNumber]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ bgcolor: "#4e6d9c" }}>
        <Toolbar variant="dense" disableGutters>
          <NavItem>Hệ thống</NavItem>
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
          active
          onClick={() => handSecondaryNavItemClick("/operation/deposit_withdrawal")}
        />
        <SecondaryNavItem
          icon={<GroupIcon />}
          label="Chuyển tiền"
          onClick={() => handSecondaryNavItemClick("/operation/transaction")}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gửi/Rút Tiền
          </Typography>

          {/* Account Number Input */}
          <TextField
            fullWidth
            label="Số tài khoản"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            margin="normal"
            disabled={loading}
          />

          {/* Loading Indicator */}
          {loading && <CircularProgress size={24} sx={{ my: 2 }} />}

          {/* Account Details */}
          {accountDetails && !loading && (
            <Box sx={{ mt: 2, mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography>
                <strong>Số tài khoản:</strong> {accountDetails.SOTK}
              </Typography>
              <Typography>
                <strong>CMND:</strong> {accountDetails.CMND}
              </Typography>
              <Typography>
                <strong>Số dư:</strong> {accountDetails.SODU.toLocaleString()} VND
              </Typography>
              <Typography>
                <strong>Chi nhánh:</strong> {accountDetails.MACN}
              </Typography>
              <Typography>
                <strong>Ngày mở TK:</strong>{" "}
                {new Date(accountDetails.NGAYMOTK).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {/* Amount Input */}
          <TextField
            fullWidth
            label="Số tiền (VND)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            type="number"
            disabled={loading || !accountDetails}
          />

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

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleTransaction("GT")}
              disabled={loading || !accountDetails}
              sx={{ flex: 1 }}
            >
              Gửi tiền
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleTransaction("RT")}
              disabled={loading || !accountDetails}
              sx={{ flex: 1 }}
            >
              Rút tiền
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}