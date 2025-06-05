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

  // sử dụng để lấy dữ liệu từ form
  const [formData, setFormData] = useState<Staff>({
    MANV: "",
    HO: "",
    TEN: "",
    CMND: "",
    DIACHI: "",
    PHAI: "",
    SODT: "",
    MACN: "", // Branch code
    TrangThaiXoa: null
  });
  // State to hold the list of accounts
  const [listStaff, setListStaff] = useState<Staff[]>([]);
  const [listStaffSearch, setListStaffSearch] = useState<Staff[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStaff();
        console.log(data)
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
          handleFieldChange(data.data[0].MACN, "MACN"); 
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
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [fieldName]: value,
      };
      return newData;
    });
  };

  const handleContextMenu = (event: React.MouseEvent, staff: Staff) => {
    event.preventDefault();
    setFormData({
      MANV: staff.MANV,
      HO: staff.HO,
      TEN: staff.TEN,
      CMND: staff.CMND,
      DIACHI: staff.DIACHI,
      PHAI: staff.PHAI,
      SODT: staff.SODT,
      MACN: staff.MACN, 
      TrangThaiXoa: staff.TrangThaiXoa
    });
    setStatusAdd(2);
  };

  const handleSubmit = () => {
    console.log(formData)
    if (statusAdd == 1) {
      if (formData.MANV == "") {
        alert("Mã nhân viên không được để trống")
        return;
      }
      if (formData.CMND == "") {
        alert("CMND không được để trống");
        return;
      }
      if (formData.HO == "") {
        alert("Họ không được để trống");
        return;
      }
      if (formData.TEN == "") {
        alert("Tên không được để trống");
        return;
      }
      if (formData.DIACHI == "") {
        alert("Địa chỉ không được để trống");
        return;
      }
      if (formData.PHAI == "") {
        alert("Phái không được để trống");
        return;
      }
      if (formData.SODT == "") {
        alert("Số điện thoại không được để trống");
        return;
      }
      if (formData.MACN == "") {
        alert("Mã chi nhánh không được để trống");
        return;
      }
      postStaff(formData)
        .then((response: any) => {
          console.log(response)
          if (response.status == 200) {
            alert(response.data.message);
            window.location.reload();
            setStatusAdd(0);
            setFormData({
              MANV: "",
              HO: "",
              TEN: "",
              CMND: "",
              DIACHI: "",
              PHAI: "",
              SODT: "",
              MACN: "", // Branch code
              TrangThaiXoa: null
            });
          }
        })
      // Call the API to add a new customer
      // postCustomer(formData)
      //   .then((response: any) => {
      //     alert(response.data.message);
      //     window.location.reload();
      //     setStatusAdd(0);
      //     setFormData({
      //       MANV: "",
      //       HO: "",
      //       TEN: "",
      //       CMND: "",
      //       DIACHI: "",
      //       PHAI: "",
      //       SODT: "",
      //       MACN: "", // Branch code
      //       TrangThaiXoa: null
      //     });
      //     // Optionally, you can reset the form or update the customer list here
      //   })
      //   .catch((error) => {
      //     // console.error("Error adding customer:", error);
      //     alert(error.message);
      //   });
    }
    if (statusAdd == 2) {
      if (formData.CMND == "") {
        alert("CMND không được để trống");
        return;
      }
      if (formData.HO == "") {
        alert("Họ không được để trống");
        return;
      }
      if (formData.TEN == "") {
        alert("Tên không được để trống");
        return;
      }
      if (formData.DIACHI == "") {
        alert("Địa chỉ không được để trống");
        return;
      }
      if (formData.PHAI == "") {
        alert("Phái không được để trống");
        return;
      }
      if (formData.SODT == "") {
        alert("Số điện thoại không được để trống");
        return;
      }
      if (formData.MACN == "") {
        alert("Mã chi nhánh không được để trống");
        return;
      }
      if (formData.TrangThaiXoa =! 1 && formData.TrangThaiXoa != 0) {
        alert("Trạng thái làm việc không được để trống")
        return
      }
      putStaff(formData)
        .then((response: any) => {
          console.log(response)
          if (response.status == 200) {
            // alert(response.data.message);
            // window.location.reload();
            setStatusAdd(0);
            setFormData({
              MANV: "",
              HO: "",
              TEN: "",
              CMND: "",
              DIACHI: "",
              PHAI: "",
              SODT: "",
              MACN: "", // Branch code
              TrangThaiXoa: null
            });
          }
        })
      // Call the API to update the customer
      // putCustomer(formData)
      //   .then((response: any) => {
      //     alert(response.data.message);
      //     window.location.reload();
      //     setStatusAdd(0);
      //     setFormData({
      //       MANV: "",
      //       HO: "",
      //       TEN: "",
      //       CMND: "",
      //       DIACHI: "",
      //       PHAI: "",
      //       SODT: "",
      //       MACN: "", // Branch code
      //       TrangThaiXoa: null
      //     });
      //     // Optionally, you can reset the form or update the customer list here
      //   })
      //   .catch((error) => {
      //     // console.error("Error updating customer:", error);
      //     alert(error.message);
      //   });
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
                    staff.SODT.toLowerCase().includes(
                      searchValue.toLowerCase()
                    )
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
                          console.log(item)
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
                              return "Trụ sở chính"
                            }
                            return item.MACN
                          })()}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.TrangThaiXoa == 1 ? "Đã nghỉ việc":"Còn làm việc"}
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
                {statusAdd == 1 ? "Thêm nhân viên" : ""}
                {statusAdd == 2 ? "Hiệu chỉnh nhân viên" : ""}
              </Typography>
            </Box>
            <Box
              sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              { statusAdd == 1 &&
                (<FormField
                label="MANV:"
                type="text"
                name="MANV"
                initialValue={formData.MANV}
                onChange={(value) => handleFieldChange(value, "MANV")}
                />)
              }
              <FormField
                label="CMND:"
                type="text"
                name="CMND"
                initialValue={formData.CMND}
                onChange={(value) => handleFieldChange(value, "CMND")}
                // disabled={statusAdd == 2 ? true : false}
              />

              <FormField
                label="Họ:"
                type="text"
                name="HO"
                initialValue={formData.HO}
                onChange={(value) => handleFieldChange(value, "HO")}
              />
              <FormField
                label="Tên:"
                type="text"
                name="TEN"
                initialValue={formData.TEN}
                onChange={(value) => handleFieldChange(value, "TEN")}
              />
              <Box sx={{mb: 2}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Phái</InputLabel>
                  <Select
                    label="Phái"
                    defaultValue={""}
                    value={formData.PHAI}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d0d0d0",
                      },
                    }}
                    onChange={(e) => handleFieldChange(e.target.value, "PHAI")}>
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <FormField
                label="Địa chỉ:"
                type="Text"
                name="DIACHI"
                initialValue={formData.DIACHI}
                onChange={(value) => handleFieldChange(value, "DIACHI")}
              />
              <FormField
                label="Số điện thoại:"
                type="Text"
                name="SODT"
                initialValue={formData.SODT}
                onChange={(value) => handleFieldChange(value, "SODT")}
              />

              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel>Mã chi nhánh:</InputLabel>
                  <Select
                    defaultValue={(() => {
                      if (statusAdd == 1) {
                        return selectedBranch
                      }
                      return formData.MACN
                    })()}
                    value={(() => {
                      if (statusAdd == 1) {
                        return selectedBranch
                      }
                      return formData.MACN
                    })()}
                    disabled= {true}
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
                </FormControl>
              </Box>
              <Box sx={{
                mt: 3
              }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái công việc</InputLabel>
                  <Select
                    disabled = {statusAdd == 1? true : false}
                    label="Trạng thái công việc"
                    defaultValue={""}
                    value={formData.TrangThaiXoa == 1? "1" : "0"}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d0d0d0",
                      },
                    }}
                    onChange={(e) => {
                      let value = e.target.value == "1"? 1:0
                      console.log(value)
                      handleFieldChange(value, "TrangThaiXoa")
                    }}>
                    <MenuItem value="0">Còn làm việc</MenuItem>
                    <MenuItem value="1">Đã nghỉ việc</MenuItem>
                  </Select>
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
                    setFormData({
                      MANV: "",
                      HO: "",
                      TEN: "",
                      CMND: "",
                      DIACHI: "",
                      PHAI: "",
                      SODT: "",
                      MACN: "",
                      TrangThaiXoa: null
                    });
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
