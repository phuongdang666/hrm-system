import { useState, useEffect } from "react";
import { Link, useForm } from '@inertiajs/react';
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

interface FormErrors {
  message?: string;
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
  [key: string]: string | undefined;
}

export default function SignUpAdminForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    terms: false,
  });

  // Cập nhật lỗi từ server
  useEffect(() => {
    setFormErrors(errors as FormErrors);
  }, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/signup', {
      onSuccess: () => {
        reset();
        setIsChecked(false);
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng ký Admin
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập thông tin của bạn để tạo tài khoản admin!
            </p>
          </div>
          
          {/* Hiển thị thông báo lỗi chung */}
          {formErrors.message && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
              {formErrors.message}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Tên */}
                <div>
                  <Label htmlFor="name">
                    Họ và tên<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="Nhập họ và tên của bạn"
                    error={!!formErrors.name}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-error-500">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <Label htmlFor="email">
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    placeholder="Nhập địa chỉ email"
                    error={!!formErrors.email}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-error-500">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Password */}
                <div>
                  <Label htmlFor="password">
                    Mật khẩu<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                      placeholder="Nhập mật khẩu"
                      type={showPassword ? "text" : "password"}
                      error={!!formErrors.password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-error-500">{formErrors.password}</p>
                  )}
                </div>
                
                {/* Checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    className="w-5 h-5 mt-0.5"
                    checked={isChecked}
                    onChange={(checked) => {
                      setIsChecked(checked);
                      setData('terms', checked);
                    }}
                  />
                  <label htmlFor="terms" className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Bằng việc tạo tài khoản, bạn đồng ý với{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Điều khoản dịch vụ,
                    </span>{" "}
                    và{" "}
                    <span className="text-gray-800 dark:text-white">
                      Chính sách bảo mật
                    </span>
                    của chúng tôi
                  </label>
                </div>
                {formErrors.terms && (
                  <p className="text-sm text-error-500">{formErrors.terms}</p>
                )}
                
                {/* Button */}
                <div>
                  <button
                    type="submit"
                    disabled={processing || !isChecked}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : 'Đăng ký'}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Đã có tài khoản? {""}
                <Link
                  href="/admin/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}