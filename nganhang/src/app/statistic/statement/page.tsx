"use client";
import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import ClearIcon from "@mui/icons-material/Clear";
import { NavItem } from "@/components/NavItem";
import { SecondaryNavItem } from "@/components/SecondaryNavItem";
import axiosInstance from "@/utils/axiosConfig";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface Transaction {
  SO_DU_TRUOC: number;
  NGAY: string;
  LOAI_GIAO_DICH: string;
  SO_TIEN: number;
  SO_DU_SAU: number;
}

export default function AccountStatement() {
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSecondaryNavItemClick = (path: string) => {
    window.location.href = path;
  };

  const handleFetchStatement = async () => {
    if (!accountNumber) {
      setError("Vui lòng nhập số tài khoản.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
      return;
    }
    if (startDate > endDate) {
      setError("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/account-statement", {
        SOTK_SAO_KE: accountNumber,
        NGAY_BAT_DAU: format(startDate, "yyyy-MM-dd"),
        NGAY_KET_THUC: format(endDate, "yyyy-MM-dd"),
      });

      const data = response.data.data || [];
      const parsedTransactions = data.map((tx: Transaction) => ({
        ...tx,
        NGAY: typeof tx.NGAY === "string" ? tx.NGAY : new Date(tx.NGAY).toISOString(),
      }));
      setTransactions(parsedTransactions);
    } catch (err: any) {
      setError(err.response?.data?.error || "Đã xảy ra lỗi khi lấy sao kê.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAccountNumber("");
    setStartDate(null);
    setEndDate(null);
    setTransactions([]);
    setError(null);
  };

  const formatTransactionType = (type: string): string => {
    switch (type.trim()) {
      case "GT":
        return "Gửi tiền";
      case "RT":
        return "Rút tiền";
      case "CT":
        return "Chuyển tiền";
      case "NT":
        return "Nhận tiền";
      default:
        return type;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      <AppBar position="static" sx={{ bgcolor: "#4e6d9c" }}>
        <Toolbar variant="dense" disableGutters>
          <NavItem>Hệ thống</NavItem>
          <NavItem handleClick={() => handleSecondaryNavItemClick("/management/customers")}>
            Quản lý
          </NavItem>
          <NavItem handleClick={() => handleSecondaryNavItemClick("/operation/deposit_withdrawal")}>
            Nghiệp vụ
          </NavItem>
          <NavItem handleClick={() => handleSecondaryNavItemClick("/statistic/account")} active>
            Thống kê
          </NavItem>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", borderBottom: "1px solid #d0d0d0", bgcolor: "#fafafa" }}>
        <SecondaryNavItem
          icon={<AccountBalanceIcon />}
          label="Tài khoản"
          onClick={() => handleSecondaryNavItemClick("/statistic/account")}
        />
        <SecondaryNavItem
          icon={<GroupIcon />}
          label="Khách hàng"
          onClick={() => handleSecondaryNavItemClick("/statistic/customer")}
        />
        <SecondaryNavItem
          icon={<GroupIcon />}
          label="Sao kê"
          active
          onClick={() => handleSecondaryNavItemClick("/statistic/statement")}
        />
      </Box>

      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sao kê giao dịch
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <TextField
              label="Số tài khoản"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              error={!!error && !accountNumber}
              helperText={!!error && !accountNumber ? "Số tài khoản là bắt buộc" : ""}
              sx={{ width: 200 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Ngày bắt đầu"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    error: !!error && !startDate,
                    helperText: !!error && !startDate ? "Chọn ngày bắt đầu" : "",
                    sx: { width: 200 },
                  },
                }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    error: !!error && !endDate,
                    helperText: !!error && !endDate ? "Chọn ngày kết thúc" : "",
                    sx: { width: 200 },
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              onClick={handleFetchStatement}
              disabled={loading}
              sx={{ height: 56 }}
            >
              {loading ? <CircularProgress size={24} /> : "Tìm kiếm"}
            </Button>
            <IconButton onClick={handleClear} color="error" sx={{ height: 56, width: 56 }}>
              <ClearIcon />
            </IconButton>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        <Paper>
          {transactions.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Số dư đầu</TableCell>
                    <TableCell>Ngày</TableCell>
                    <TableCell>Loại giao dịch</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Số dư sau</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={`${transaction.NGAY}-${index}`}>
                      <TableCell>
                        {transaction.SO_DU_TRUOC.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(transaction.NGAY), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                      </TableCell>
                      <TableCell>{formatTransactionType(transaction.LOAI_GIAO_DICH)}</TableCell>
                      <TableCell>
                        {transaction.SO_TIEN.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell>
                        {transaction.SO_DU_SAU.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                Không có giao dịch
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}