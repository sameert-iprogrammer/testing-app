import React, { useState } from 'react';
import { User, Mail, MapPin, Check, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useProfileForm } from '../hooks/useProfileForm';
import { usePasswordForm } from '../hooks/usePasswordForm';
import useAuth from '../hooks/useAuth';

interface FormFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "password" | "number";
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  icon,
  error,
  onChange,
  onBlur,
  showPassword,
  onTogglePassword,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
        {icon}
      </div>
      <input
        id={id}
        type={type === "password" && showPassword ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
      />
      {type === "password" && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="text-rose-400 text-xs mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { formData: profileFormData, errors: profileErrors, isFormValid: isProfileValid, handleInputChange: handleProfileChange, validateEmail, validateRequired, setFieldError: setProfileError, handleSubmit: handleProfileSubmit } = useProfileForm();
  const { auth, changePassword } = useAuth();
  const { formData: passwordFormData, errors: passwordErrors, isFormValid: isPasswordValid, handleInputChange: handlePasswordChange, validateNewPassword, validateConfirmPassword, setFieldError: setPasswordError, handleSubmit: handlePasswordSubmit } = usePasswordForm();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-slate-400">Manage your account information</p>
      </div>

      {/* Profile Form */}
      <div className="max-w-2xl">
        <form onSubmit={(e) => handleProfileSubmit(e, showToast)} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
          <FormField
            id="name"
            label="Name"
            type="text"
            value={profileFormData.name}
            placeholder="Enter your name"
            icon={<User className="h-5 w-5" />}
            error={profileErrors.name}
            onChange={(value) => handleProfileChange('name', value)}
            onBlur={(value) => {
              const nameError = validateRequired(value, 'Name');
              if (nameError) {
                setProfileError('name', nameError);
              }
            }}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={profileFormData.email}
            placeholder="Enter your email"
            icon={<Mail className="h-5 w-5" />}
            error={profileErrors.email}
            onChange={(value) => handleProfileChange('email', value)}
            onBlur={(value) => {
              const emailError = validateEmail(value);
              if (emailError) {
                setProfileError('email', emailError);
              }
            }}
          />

          <FormField
            id="address"
            label="Address"
            type="text"
            value={profileFormData.address}
            placeholder="Enter your address"
            icon={<MapPin className="h-5 w-5" />}
            error={profileErrors.address}
            onChange={(value) => handleProfileChange('address', value)}
            onBlur={(value) => {
              const addressError = validateRequired(value, 'Address');
              if (addressError) {
                setProfileError('address', addressError);
              }
            }}
          />

          <button
            type="submit"
            disabled={!isProfileValid}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="h-4 w-4" />
            Update Profile
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="max-w-2xl">
        <form onSubmit={(e) => handlePasswordSubmit(e, changePassword, showToast)} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Lock className="h-5 w-5" />
            Change Password
          </h2>

          <FormField
            id="currentPassword"
            label="Current Password"
            type="password"
            value={passwordFormData.currentPassword}
            placeholder="Enter current password"
            icon={<Key className="h-5 w-5" />}
            showPassword={showCurrentPassword}
            onTogglePassword={() => setShowCurrentPassword((p) => !p)}
            error={passwordErrors.currentPassword}
            onChange={(v) => handlePasswordChange('currentPassword', v)}
            onBlur={() => {}}
          />

          <FormField
            id="newPassword"
            label="New Password"
            type="password"
            value={passwordFormData.newPassword}
            placeholder="Enter new password"
            icon={<Key className="h-5 w-5" />}
            showPassword={showNewPassword}
            onTogglePassword={() => setShowNewPassword((p) => !p)}
            error={passwordErrors.newPassword}
            onChange={(v) => handlePasswordChange('newPassword', v)}
            onBlur={() => {
              const err = validateNewPassword(passwordFormData.newPassword);
              if (err) setPasswordError('newPassword', err);
            }}
          />

          <FormField
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={passwordFormData.confirmPassword}
            placeholder="Confirm new password"
            icon={<Key className="h-5 w-5" />}
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword((p) => !p)}
            error={passwordErrors.confirmPassword}
            onChange={(v) => handlePasswordChange('confirmPassword', v)}
            onBlur={() => {
              const err = validateConfirmPassword(passwordFormData.confirmPassword);
              if (err) setPasswordError('confirmPassword', err);
            }}
          />

          <button
            type="submit"
            disabled={!isPasswordValid}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
