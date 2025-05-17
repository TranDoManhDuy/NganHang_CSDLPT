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

// Import the customers-specific CSS
import "./page.css";
import { NavItem } from "@/components/NavItem";
import { FormField } from "@/components/FormField";
import { SecondaryNavItem } from "@/components/SecondaryNavItem";

import { getCustomers } from "@/utils/customerAPI"; // Adjust the import path as necessary

import { getBranches } from "@/utils/branchesAPI"; // Adjust the import path as necessary

export default function ManagementInterface() {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [statusAdd, setStatusAdd] = useState(0);
  // State to hold the form data

  const [formData, setFormData] = useState({
    CMND: "",
    HO: "",
    TEN: "",
    DIACHI: "",
    PHAI: "",
    NGAYCAP: "",
    SODT: "",
    MACN: "", // Branch code
  });
  // State to hold the list of accounts
  const [listCustomer, setListCustomer] = useState([
    {
      CMND: "123456789",
      HO: "Nguyen",
      TEN: "Van A",
      DIACHI: "123 Street",
      PHAI: "Nam",
      NGAYCAP: "2023-01-01",
      SODT: "0987654321",
      MACN: "CN001",
    },
  ]);
  const [listCustomerSearch, setListCustomerSearch] = useState([
    {
      CMND: "123456789",
      HO: "Nguyen",
      TEN: "Van A",
      DIACHI: "123 Street",
      PHAI: "Nam",
      NGAYCAP: "2023-01-01",
      SODT: "0987654321",
      MACN: "CN001",
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCustomers();
        if (data) {
          setListCustomer(data.data);
          setListCustomerSearch(data.data);
          return;
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
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
          handleFieldChange(data.data[0].MACN, "macn"); // Set the default value for the branch field
          return;
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };
    fetchData();
  }, []);
  //
  const handleFieldChange = (value: any, fieldName: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const handleSubmit = () => {
    // const { CMND, macn } = formData;
    // if (!CMND || !macn) {
    //   alert("Vui lòng nhập đầy đủ thông tin");
    //   return;
    // }
    // try {
    //   postAccount({ CMND, macn });
    // } catch (error) {
    //   console.error("Error creating account:", error);
    // }
    // // alert("Tạo tài khoản thành công");
    // setStatusAdd(0);
    // // Perform the API call to create a new account
  };
  //

  const handSecondaryNavItemClick = (path: string) => {
    // Handle navigation to the selected path
    // For example, using React Router's useHistory or useNavigate
    // history.push(path);
    // or
    // navigate(path);
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
          <NavItem>Hệ thống</NavItem>
          <NavItem active>Quản lý</NavItem>
          <NavItem>Nghiệp vụ</NavItem>
          <NavItem>Thống kê</NavItem>
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
          active
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
        {/* Accounts List */}
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
              Danh sách khách hàng
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
              Thêm khách hàng mới
            </Button>
          </Box>

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
            <TextField
              placeholder="Tìm kiếm khách hàng theo tên, CMND..."
              size="small"
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": { borderColor: "#d0d0d0" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "#666666" }} />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                const searchValue = e.target.value;

                // if (searchValue) {
                //   const filteredAccounts = listAccount.filter((account) =>
                //     account.SOTK.includes(searchValue)
                //   );
                //   setListAccount(filteredAccounts);
                // } else {
                //   // Reset to original list if search is cleared
                //   setListAccount(listAccountSearch);
                // }
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
                        CMND
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
                        Ngày cấp
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Số điện thoại
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Mã chi nhánh
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}></TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(listCustomer).map((item, index) => (
                      <TableRow
                        key={item.CMND}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          console.log("Right-clicked on row:", item);
                          setStatusAdd(2);
                        }}>
                        <TableCell className="mui-table-cell">
                          {item.CMND}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.HO}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.TEN}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.DIACHI}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.PHAI}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.NGAYCAP}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.SODT}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.MACN}
                        </TableCell>
                        {/* <TableCell className="mui-table-cell">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setStatusAdd(true);
                            }}
                            sx={{
                              bgcolor: "white",
                              color: "black",
                              borderColor: "#d0d0d0",
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "#a0a0a0",
                                bgcolor: "#f8f8f8",
                              },
                            }}>
                            Chi tiết
                          </Button>
                        </TableCell> */}
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
          action={handleSubmit}
          style={{ display: statusAdd == 0 ? "none" : "" }}>
          <Paper sx={{ width: 350, border: "1px solid #d0d0d0" }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "#f0f0f0",
                borderBottom: "1px solid #d0d0d0",
              }}>
              <Typography sx={{ fontWeight: 500 }}>
                {statusAdd == 1 ? "Thêm khách hàng" : ""}
                {statusAdd == 2 ? "Hiểu chỉnh khách hàng" : ""}
              </Typography>
            </Box>

            <Box
              sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormField
                label="CMND:"
                type="CMND"
                name="CMND"
                initialValue={formData.CMND}
                onChange={handleFieldChange}
              />
              <FormField
                label="Họ:"
                type="Text"
                name="HO"
                initialValue={formData.HO}
                onChange={handleFieldChange}
              />
              <FormField
                label="Tên:"
                type="Text"
                name="TEN"
                initialValue={formData.TEN}
                onChange={handleFieldChange}
              />
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel>Phái:</InputLabel>
                  <Select
                    label="Phái:"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d0d0d0",
                      },
                    }}
                    onChange={handleFieldChange}>
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nu">Nữ</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormField
                label="Địa chỉ:"
                type="Text"
                name="DIACHI"
                initialValue={formData.DIACHI}
                onChange={handleFieldChange}
              />
              <FormField
                label="Số điện thoại:"
                type="Text"
                name="SODT"
                initialValue={formData.SODT}
                onChange={handleFieldChange}
              />

              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel>Mã chi nhánh:</InputLabel>
                  <Select
                    defaultValue={""}
                    // value={formData.macn}
                    label="Mã chi nhánh:"
                    onChange={(e) => handleFieldChange(e.target.value, "macn")}
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
                </FormControl>
              </Box>

              {/* <Box display={{ display: statusAdd === 2 ? "" : "none" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Trạng thái xóa"
                />
              </Box> */}

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
                  onClick={() => setStatusAdd(0)}
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
