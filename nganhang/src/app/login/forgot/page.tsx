import ForgotForm from "./ForgotForm";

export default function ForgotPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Lấy lại mật khẩu</h1>
            <ForgotForm />
          </div>
        </div>
      );
}