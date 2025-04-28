"use client";

import { useState } from "react";

export default function ForgotForm() {
    const [account_type, setAccountType] = useState("")
    const [account_number, setAccount_number] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [soDt, setSoDT] = useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login with", { account_number, soDt, newPassword, confirmPassword });
    };
    return (
        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label htmlFor="account_type" className="block text-sm font-medium text-gray-700">
                Loại tài khoản
                </label>
                <select
                id="account_type"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={account_type}
                onChange={(e) => setAccountType(e.target.value)}
                required
                >
                <option value="chinhanh">Chi nhánh</option>
                <option value="nganhang">Ngân hàng</option>
                </select>
            </div>
            <div>
                <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">
                Số tài khoản
                </label>
                <input
                type="number"
                id="account_number"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={account_number}
                onChange={(e) => setAccount_number(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="soDT" className="block text-sm font-medium text-gray-700">
                Số điện thoại
                </label>
                <input
                type="number"
                id="soDT"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={soDt}
                onChange={(e) => setSoDT(e.target.value)}
                required
                />
            </div>

            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
                </label>
                <input
                type="password"
                id="newPassword"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                />
            </div>
            
            <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
                </label>
                <input
                type="password"
                id="confirmNewPassword"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </div>
            
            <button
                type="submit"
                className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 transition duration-200"
            >
                Xác nhận
            </button>
        </form>
    );
}