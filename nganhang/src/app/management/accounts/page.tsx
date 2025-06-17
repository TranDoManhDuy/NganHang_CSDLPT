"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import "./page.css"; // Adjust the path as necessary
import { NavItem } from "@/components/NavItem";
import { FormField } from "@/components/FormField";
import { SecondaryNavItem } from "@/components/SecondaryNavItem";

import { getAllAccount, postAccount } from "@/utils/accountAPI"; // Adjust the import path as necessary

import { getBranches } from "@/utils/branchesAPI"; // Adjust the import path as necessary

// Schema validation cho form
const accountSchema = z.object({
  CMND: z.string().min(1, "CMND không được để trống"),
  macn: z.string().min(1, "Mã chi nhánh không được để trống"),
});

type FormData = z.infer<typeof accountSchema>;

export default function ManagementInterface() {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [statusAdd, setStatusAdd] = useState(false);
  const [listAccount, setListAccount] = useState([
    {
      SOTK: "123456789",
      CMND: "123456789",
      SODU: "1000000",
      MACN: "CN001",
      NGAYMOTK: "2023-01-01",
    },
  ]);
  const [listAccountSearch, setListAccountSearch] = useState([
    {
      SOTK: "123456789",
      CMND: "123456789",
      SODU: "1000000",
      MACN: "CN001",
      NGAYMOTK: "2023-01-01",
    },
  ]);
  const [listBranch, setListBranch] = useState([
    {
      MACN: "CN001",
      TENCN: "Chi nhánh 1",
    },
  ]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      CMND: "",
      macn: "",
    },
  });

  const linkNavitems = [
    { label: "Quản lý", path: "/management/customers" },
    { label: "Nghiệp vụ", path: "operation/deposit_withdrawal" },
    { label: "Thống kê", path: "/statistic/account" },
  ];
  const handleNavItemClick = (path: string) => {
    // Handle navigation to the selected path
    window.location.pathname = path;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAccount();
        setListAccount(data.data);
        setListAccountSearch(data.data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };
    fetchData();
  }, []);
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
    setValue(fieldName, value);
  };
  const handleSubmitForm = (data: FormData) => {
    postAccount(data)
      .then((response) => {
        alert(response.data.message);
        window.location.reload();
        setStatusAdd(false);
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  //

  const handSecondaryNavItemClick = (path: string) => {
    location.href = path;
  };
  const handleContextMenu = (event: React.MouseEvent, account: Object) => {};
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
            handleClick={() => handleNavItemClick(linkNavitems[0].path)}>
            {linkNavitems[0].label}
          </NavItem>
          <NavItem
            handleClick={() => handleNavItemClick(linkNavitems[1].path)}>
            {linkNavitems[1].label}
          </NavItem>
          <NavItem
            handleClick={() => handleNavItemClick(linkNavitems[2].path)}>
            {linkNavitems[2].label}
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
          active
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
              Danh sách tài khoản
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setStatusAdd(true)}
              disabled={statusAdd}
              sx={{
                bgcolor: "white",
                color: "black",
                borderColor: "#d0d0d0",
                textTransform: "none",
                "&:hover": { borderColor: "#a0a0a0", bgcolor: "#f8f8f8" },
              }}>
              Mở tài khoản mới
            </Button>
          </Box>

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
            <TextField
              placeholder="Tìm kiếm tài khoản theo số tài khoản"
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

                if (searchValue) {
                  const filteredAccounts = listAccount.filter((account) =>
                    account.SOTK.includes(searchValue)
                  );
                  setListAccount(filteredAccounts);
                } else {
                  // Reset to original list if search is cleared
                  setListAccount(listAccountSearch);
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
                        Số tài khoản
                      </TableCell>
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
                        Số dư
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Chi nhánh
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #d0d0d0",
                          bgcolor: "#b9b9b9",
                        }}>
                        Ngày mở tài khoản
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
                    {Array.from(listAccount).map((item, index) => (
                      <TableRow key={item.SOTK}>
                        <TableCell className="mui-table-cell">
                          {item.SOTK}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.CMND}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.SODU}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.MACN}
                        </TableCell>
                        <TableCell className="mui-table-cell">
                          {item.NGAYMOTK}
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
          onSubmit={handleSubmit(handleSubmitForm)}
          style={{ display: statusAdd ? "block" : "none" }}>
          <Paper sx={{ width: 350, border: "1px solid #d0d0d0" }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "#f0f0f0",
                borderBottom: "1px solid #d0d0d0",
              }}>
              <Typography sx={{ fontWeight: 500 }}>
                Tạo tài khoản mới
              </Typography>
            </Box>

            <Box
              sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormField
                label="CMND:"
                type="CMND"
                name="CMND"
                control={control}
              />

              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel>Mã chi nhánh:</InputLabel>
                  <Controller
                    name="macn"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
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
                  onClick={() => setStatusAdd(false)}
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
