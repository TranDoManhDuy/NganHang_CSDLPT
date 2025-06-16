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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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

interface AccountDetails {
  SOTK: string;
  CMND: string;
  SODU: number;
  MACN: string;
  NGAYMOTK: string;
  HO: string;
  TEN: string;
  DIACHI: string;
  PHAI: string;
  SODT: string;
}

export default function DepositWithdrawalNavbars() {
  const [branch, setBranch] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [accounts, setAccounts] = useState<AccountDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handSecondaryNavItemClick = (path: string) => {
    location.href = path;
  };

  const handleSearch = async () => {
    if (!branch) {
      setError("Vui lòng chọn chi nhánh");
      return;
    }
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }
    if (startDate > endDate) {
      setError("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/api/account-statistics", {
        MACN: branch,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
      });

      if (response.status === 200 && response.data.data) {
        setAccounts(response.data.data);
        setSuccess("Lấy thống kê tài khoản thành công");
      } else {
        setError(response.data.error || "Không tìm thấy dữ liệu thống kê");
        setAccounts([]);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Đã có lỗi xảy ra khi lấy thống kê";
      setError(errorMessage);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBranch("ALL");
    setStartDate(new Date());
    setEndDate(new Date());
    setAccounts([]);
    setError("");
    setSuccess("");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      <AppBar position="static" sx={{ bgcolor: "#4e6d9c" }}>
        <Toolbar variant="dense" disableGutters>
          <NavItem
            handleClick={() =>
              handSecondaryNavItemClick("/management/customers")
            }>
            Quản lý
          </NavItem>
          <NavItem
            handleClick={() =>
              handSecondaryNavItemClick("/operation/deposit_withdrawal")
            }>
            Nghiệp vụ
          </NavItem>
          <NavItem
            handleClick={() => handSecondaryNavItemClick("/statistic/account")}
            active>
            Thống kê
          </NavItem>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #d0d0d0",
          bgcolor: "#fafafa",
        }}>
        <SecondaryNavItem
          icon={<AccountBalanceIcon />}
          label="Tài khoản"
          active
          onClick={() => handSecondaryNavItemClick("/statistic/account")}
        />
        {/* <SecondaryNavItem
          icon={<GroupIcon />}
          label="Khách hàng"
          onClick={() => handSecondaryNavItemClick("/statistic/customer")}
        /> */}
        <SecondaryNavItem
          icon={<GroupIcon />}
          label="Sao kê"
          onClick={() => handSecondaryNavItemClick("/statistic/statement")}
        />
      </Box>

      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thống Kê Tài Khoản
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
              mb: 3,
            }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="branch-select-label">Chi nhánh</InputLabel>
              <Select
                labelId="branch-select-label"
                value={branch}
                label="Chi nhánh"
                onChange={(e) => setBranch(e.target.value as string)}
                disabled={loading}>
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="BENTHANH">Bến Thành</MenuItem>
                <MenuItem value="TANDINH">Tân Định</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày bắt đầu"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                disabled={loading}
                slotProps={{
                  textField: {
                    sx: { width: 200 },
                  },
                }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                disabled={loading}
                slotProps={{
                  textField: {
                    sx: { width: 200 },
                  },
                }}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={loading}
              sx={{ height: 40 }}>
              Tìm kiếm
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClear}
              disabled={loading}
              startIcon={<ClearIcon />}
              sx={{ height: 40 }}>
              Xóa
            </Button>
          </Box>

          {loading && (
            <CircularProgress
              size={24}
              sx={{ my: 2, display: "block", mx: "auto" }}
            />
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          {accounts.length > 0 && (
            <TableContainer component={Paper} sx={{ maxHeight: 400, mt: 3 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Số tài khoản</TableCell>
                    <TableCell>CMND</TableCell>
                    <TableCell>Số dư</TableCell>
                    <TableCell>Chi nhánh</TableCell>
                    <TableCell>Ngày mở TK</TableCell>
                    <TableCell>Họ</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account, index) => (
                    <TableRow key={index}>
                      <TableCell>{account.SOTK}</TableCell>
                      <TableCell>{account.CMND}</TableCell>
                      <TableCell>
                        {account.SODU.toLocaleString("vi-VN")} VND
                      </TableCell>
                      <TableCell>{account.MACN}</TableCell>
                      <TableCell>
                        {new Date(account.NGAYMOTK).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{account.HO}</TableCell>
                      <TableCell>{account.TEN}</TableCell>
                      <TableCell>{account.DIACHI}</TableCell>
                      <TableCell>{account.PHAI}</TableCell>
                      <TableCell>{account.SODT}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
