"use client";
import React, { Fragment, useState } from "react";
import { getCustomers } from "@/utils/customerAPI";
import { login } from "@/utils/auth";
export default function LoginForm() {
  const [account_type, setAccountType] = useState("chinhanh");
  const [account_number, setAccount_number] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(account_number, password, account_type);

    if (result.success && result.access_token) {
      window.location.href = "/management/customers"; // Chuyển hướng về trang chính sau khi đăng nhập thành công
      console.log("🔐 Token:", result.access_token);
      localStorage.setItem(
        "token",
        JSON.stringify({ access_token: result.access_token })
      );
      // Chuyển hướng hoặc cập nhật trạng thái đăng nhập tại đây nếu cần
    } else {
      alert(result.message);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label
            htmlFor="account_type"
            className="block text-sm font-medium text-gray-700">
            Loại tài khoản
          </label>
          <select
            id="account_type"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={account_type}
            onChange={(e) => setAccountType(e.target.value)}
            required>
            <option value="chinhanh">Chi nhánh</option>
            <option value="nganhang">Ngân hàng</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="account_number"
            className="block text-sm font-medium text-gray-700">
            Số tài khoản
          </label>
          <input
            // type="number"
            id="account_number"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={account_number}
            onChange={(e) => setAccount_number(e.target.value)}
            required
            style={{ color: "black" }} // For Firefox to hide spin buttons
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ color: "black" }}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 transition duration-200">
          Đăng nhập
        </button>
        <p className="text-center text-sm text-gray-600">
          <a href="/login/forgot" className="text-blue-600 hover:underline">
            Quên mật khẩu
          </a>
        </p>
      </form>
    </Fragment>
  );
}
