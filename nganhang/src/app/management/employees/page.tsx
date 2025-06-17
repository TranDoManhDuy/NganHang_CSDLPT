"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

// Import the customers-specific CSS
import "./page.css";
import { NavItem } from "@/components/NavItem";
import { FormField } from "@/components/FormField";
import { SecondaryNavItem } from "@/components/SecondaryNavItem";

import { getCustomers, postCustomer, putCustomer } from "@/utils/customerAPI"; // Adjust the import path as necessary

import { getBranches } from "@/utils/branchesAPI"; // Adjust the import path as necessary

import { convertToDate } from "@/utils/convert"; // Adjust the import path as necessary
import { getAllStaff, postStaff, putStaff } from "@/utils/staffAPI";

interface Staff {
  MANV: string;
  HO: string;
  TEN: string;
  CMND: string;
  DIACHI: string;
  PHAI: string;
  SODT: string;
  MACN: string;
  TrangThaiXoa: any;
}

export default function ManagementInterface() {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  // 0. Tắt hiển thị form điền thông tin
  // 1. hiển thị form thêm nhân viên
  // 2. hiển thị form chỉnh sửa nhân viên
  const [statusAdd, setStatusAdd] = useState(0);
  // State to hold the form data
  const linkNavitem = [
    { label: "Quản lý", path: "/management/customers" },
    { label: "Nghiệp vụ", path: "operation/deposit_withdrawal" },
    { label: "Thống kê", path: "/statistic/account" },
  ];
  const handleNavItemClick = (path: string) => {
    window.location.pathname = path;
  };

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
  } = useForm<Staff>({
    defaultValues: {
      MANV: "",
      HO: "",
      TEN: "",
      CMND: "",
      DIACHI: "",
      PHAI: "",
      SODT: "",
      MACN: "",
      TrangThaiXoa: "0",
    },
  });
  // State to hold the list of accounts
  const [listStaff, setListStaff] = useState<Staff[]>([]);
  const [listStaffSearch, setListStaffSearch] = useState<Staff[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStaff();
        console.log(data);
        if (data) {
          setListStaff(data.data);
          setListStaffSearch(data.data);
          return;
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };
    fetchData();
  }, []);
  // State to hold the list of branches
  const [listBranch, setListBranch] = useState([
    {
      MACN: "CN001",
      TENCN: "Chi nhánh 1",
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBranches();
        if (data) {
          setListBranch(data.data);
          setValue("MACN", data.data[0].MACN);
          setSelectedBranch(data.data[0].MACN);
          return;
        }
      } catch (error) {
        console.error("Error fetching branches data:", error);
      }
    };
    fetchData();
  }, []);
  //
  // Function to handle field changes
  // This function updates the formData state when a field changes
  const handleFieldChange = (value: any, fieldName: keyof Staff) => {
    setValue(fieldName, value);
  };

  const handleContextMenu = (event: React.MouseEvent, staff: Staff) => {
    event.preventDefault();
    setValue("MANV", staff.MANV);
    setValue("HO", staff.HO);
    setValue("TEN", staff.TEN);
    setValue("CMND", staff.CMND);
    setValue("DIACHI", staff.DIACHI);
    setValue("PHAI", staff.PHAI);
    setValue("SODT", staff.SODT);
    setValue("MACN", staff.MACN);
    setValue(
      "TrangThaiXoa",
      staff.TrangThaiXoa == null ? "0" : String(staff.TrangThaiXoa)
    );
    setStatusAdd(2);
  };

  const onSubmit = (data: Staff) => {
    if (statusAdd == 1) {
      if (data.MANV == "") {
        alert("Mã nhân viên không được để trống");
        return;
      }
      if (data.CMND == "") {
        alert("CMND không được để trống");
        return;
      }
      if (data.HO == "") {
        alert("Họ không được để trống");
        return;
      }
      if (data.TEN == "") {
        alert("Tên không được để trống");
        return;
      }
      if (data.DIACHI == "") {
        alert("Địa chỉ không được để trống");
        return;
      }
      if (data.PHAI == "") {
        alert("Phái không được để trống");
        return;
      }
      if (data.SODT == "") {
        alert("Số điện thoại không được để trống");
        return;
      }
      if (data.MACN == "") {
        alert("Mã chi nhánh không được để trống");
        return;
      }
      postStaff(data).then((response: any) => {
        console.log(response);
        if (response.status == 200) {
          alert(response.data.message);
          window.location.reload();
          setStatusAdd(0);
          reset();
        }
      });
    }
    if (statusAdd == 2) {
      if (data.CMND == "") {
        alert("CMND không được để trống");
        return;
      }
      if (data.HO == "") {
        alert("Họ không được để trống");
        return;
      }
      if (data.TEN == "") {
        alert("Tên không được để trống");
        return;
      }
      if (data.DIACHI == "") {
        alert("Địa chỉ không được để trống");
        return;
      }
      if (data.PHAI == "") {
        alert("Phái không được để trống");
        return;
      }
      if (data.SODT == "") {
        alert("Số điện thoại không được để trống");
        return;
      }
      if (data.MACN == "") {
        alert("Mã chi nhánh không được để trống");
        return;
      }
      if ((data.TrangThaiXoa = !1 && data.TrangThaiXoa != 0)) {
        alert("Trạng thái làm việc không được để trống");
        return;
      }
      putStaff(data)
        .then((response: any) => {
          console.log(response);
          if (response.status == 200) {
            alert(response.data.message);
            window.location.reload();
            setStatusAdd(0);
            reset();
          }
        })
        .catch((error: any) => {
          alert(error.response.data.message);
        });
    }
  };

  const handSecondaryNavItemClick = (path: string) => {
    location.href = path;
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f0f0f0",
      }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ bgcolor: "#4e6d9c" }}>
        <Toolbar variant="dense" disableGutters>
          <NavItem
            active
            handleClick={() => handleNavItemClick(linkNavitem[0].path)}>
            {linkNavitem[0].label}
          </NavItem>
          <NavItem handleClick={() => handleNavItemClick(linkNavitem[1].path)}>
            {linkNavitem[1].label}
          </NavItem>
          <NavItem handleClick={() => handleNavItemClick(linkNavitem[2].path)}>
            {linkNavitem[2].label}
          </NavItem>
        </Toolbar>
      </AppBar>

      {/* Secondary Navigation */}
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #d0d0d0",
          bgcolor: "#fafafa",
        }}>
        <SecondaryNavItem
          icon={<PersonIcon />}
          label="Khách hàng"
          onClick={() => handSecondaryNavItemClick("/management/customers")}
        />
        <SecondaryNavItem
          icon={<AccountBalanceIcon />}
          label="Tài khoản"
          onClick={() => handSecondaryNavItemClick("/management/accounts")}
        />
        <SecondaryNavItem
          icon={<GroupIcon />}
          label="Nhân viên"
          onClick={() => handSecondaryNavItemClick("/management/employees")}
          active
        />
      </Box>

      {/* Branch Selection */}
      <Box sx={{ p: 2, bgcolor: "#f0f0f0" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 2, fontWeight: 500 }}>Chi nhánh</Typography>
          <FormControl sx={{ width: 240 }} size="small">
            <Select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as string)}
              displayEmpty
              sx={{
                bgcolor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d0d0d0",
                },
              }}>
              {listBranch.map((item, index) => (
                <MenuItem key={index} value={item.MACN}>
                  {item.TENCN}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: "flex", flex: 1, p: 2, gap: 2 }}>
        <Paper
          sx={{
            flex: 1,
            border: "1px solid #d0d0d0",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              bgcolor: "#f0f0f0",
              borderBottom: "1px solid #d0d0d0",
            }}>
            <Typography sx={{ fontWeight: 500 }}>
              Danh sách nhân viên
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setStatusAdd(1)}
              disabled={statusAdd != 0}
              sx={{
                bgcolor: "white",
                color: "black",
                borderColor: "#d0d0d0",
                textTransform: "none",
                "&:hover": { borderColor: "#a0a0a0", bgcolor: "#f8f8f8" },
              }}>
              Thêm nhân viên mới
            </Button>
          </Box>

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
            <TextField
              placeholder="Tìm kiếm khách hàng theo CMND, họ, tên, số điện thoại"
              variant="outlined"
              size="small"
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": { borderColor: "#d0d0d0" },
              }}
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <SearchIcon fontSize="small" sx={{ color: "#666666" }} />
              //     </InputAdornment>
              //   ),
              // }}
              onChange={(e) => {
                const searchValue = e.target.value;
                const filteredStaff = listStaffSearch.filter(
                  (staff: Staff) =>
                    staff.CMND.includes(searchValue) ||
                    staff.HO.toLowerCase().includes(
                      searchValue.toLowerCase()
                    ) ||
                    staff.TEN.toLowerCase().includes(
                      searchValue.toLowerCase()
                    ) ||
                    staff.SODT.toLowerCase().includes(searchValue.toLowerCase())
                );
                setListStaff(filteredStaff);
                if (searchValue === "") {
                  setListStaff(listStaffSearch);
                }
              }}
            />

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}>
              <TableContainer
                sx={{
                  maxHeight: "calc(100vh - 250px)",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                  },
                }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Mã Nhân Viên
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Họ
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Tên
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Số CMND
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Địa chỉ
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Phái
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Số Điện Thoại
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Mã Chi Nhánh
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Trạng thái công việc
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listStaff.map((item) => (
                      <TableRow
                        key={item.CMND}
                        onContextMenu={(e) => {
                          console.log(item);
                          handleContextMenu(e, item);
                        }}>
                        <TableCell className="mui-table-cell">
                          {item.MANV}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.HO}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.TEN}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.CMND}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.DIACHI}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.PHAI}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.SODT}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {(() => {
                            if (item.MACN == null) {
                              return "Trụ sở chính";
                            }
                            return item.MACN;
                          })()}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.TrangThaiXoa == 1
                            ? "Đã nghỉ việc"
                            : "Còn làm việc"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Paper>

        {/* Customer Form */}
        <form
          onSubmit={handleFormSubmit(onSubmit)}
          style={{ display: statusAdd == 0 ? "none" : "" }}>
          <Paper sx={{ width: 350, border: "1px solid #d0d0d0" }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "#f0f0f0",
                borderBottom: "1px solid #d0d0d0",
              }}>
              <Typography sx={{ fontWeight: 500 }}>
                {statusAdd == 1 ? "Thêm nhân viên" : ""}
                {statusAdd == 2 ? "Hiệu chỉnh nhân viên" : ""}
              </Typography>
            </Box>
            <Box
              sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              {statusAdd == 1 && (
                <FormField
                  label="MANV:"
                  type="text"
                  name="MANV"
                  control={control}
                />
              )}
              <FormField
                label="CMND:"
                type="text"
                name="CMND"
                control={control}
              />

              <FormField label="Họ:" type="text" name="HO" control={control} />
              <FormField
                label="Tên:"
                type="text"
                name="TEN"
                control={control}
              />
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Phái</InputLabel>
                  <Controller
                    name="PHAI"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Phái"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d0d0d0",
                          },
                        }}>
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nữ">Nữ</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>

              <FormField
                label="Địa chỉ:"
                type="text"
                name="DIACHI"
                control={control}
              />
              <FormField
                label="Số điện thoại:"
                type="text"
                name="SODT"
                control={control}
              />

              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel>Mã chi nhánh:</InputLabel>
                  <Controller
                    name="MACN"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        disabled={true}
                        label="Mã chi nhánh:"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d0d0d0",
                          },
                        }}>
                        {listBranch.map((item, index) => (
                          <MenuItem key={index} value={item.MACN}>
                            {item.TENCN}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  mt: 3,
                }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái công việc</InputLabel>
                  <Controller
                    name="TrangThaiXoa"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value == null ? "0" : String(field.value)}
                        disabled={statusAdd == 1 ? true : false}
                        label="Trạng thái công việc"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d0d0d0",
                          },
                        }}
                        onChange={(e) => {
                          let value = e.target.value == "1" ? "1" : "0";
                          field.onChange(value);
                        }}>
                        <MenuItem value="0">Còn làm việc</MenuItem>
                        <MenuItem value="1">Đã nghỉ việc</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}>
                <Button
                  variant="contained"
                  className="button-save"
                  type="submit"
                  sx={{
                    bgcolor: "#1876d0",
                    "&:hover": { bgcolor: "#1565c0" },
                    textTransform: "none",
                  }}>
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  className="button-cancel"
                  onClick={() => {
                    setStatusAdd(0);
                    reset();
                  }}
                  sx={{
                    borderColor: "#d0d0d0",
                    color: "black",
                    "&:hover": { borderColor: "#a0a0a0", bgcolor: "#f8f8f8" },
                    textTransform: "none",
                  }}>
                  Hủy
                </Button>
              </Box>
            </Box>
          </Paper>
        </form>
      </Box>
    </Box>
  );
}
