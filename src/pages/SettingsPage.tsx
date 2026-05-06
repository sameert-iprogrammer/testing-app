import React, { useState } from 'react';
import { User, Mail, MapPin, Check, Lock, KeyRound, Eye, EyeOff, Circle } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useProfileForm } from '../hooks/useProfileForm';
import { usePasswordChangeForm } from '../hooks/usePasswordChangeForm';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
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
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
      />
    </div>
    {error && (
      <p id={`${id}-error`} className="text-rose-400 text-xs mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

interface PasswordFormFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  onChange: (value: string) => void;
}

const PasswordFormField: React.FC<PasswordFormFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  icon,
  error,
  onChange,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 z-10">
          {icon}
        </div>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={id === 'current-password' ? 'current-password' : 'new-password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-md"
        >
          {visible ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-rose-400 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { formData, errors, isFormValid, handleInputChange, validateEmail, validateRequired, setFieldError, handleSubmit } =
    useProfileForm();
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    errors: passwordErrors,
    isFormValid: isPasswordFormValid,
    ruleChecklist,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit: handlePasswordFormSubmit,
  } = usePasswordChangeForm();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-slate-400">Manage your account information</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={(e) => handleSubmit(e, showToast)} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
          <FormField
            id="name"
            label="Name"
            type="text"
            value={formData.name}
            placeholder="Enter your name"
            icon={<User className="h-5 w-5" />}
            error={errors.name}
            onChange={(value) => handleInputChange('name', value)}
            onBlur={(value) => {
              const nameError = validateRequired(value, 'Name');
              if (nameError) {
                setFieldError('name', nameError);
              }
            }}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            placeholder="Enter your email"
            icon={<Mail className="h-5 w-5" />}
            error={errors.email}
            onChange={(value) => handleInputChange('email', value)}
            onBlur={(value) => {
              const emailError = validateEmail(value);
              if (emailError) {
                setFieldError('email', emailError);
              }
            }}
          />

          <FormField
            id="address"
            label="Address"
            type="text"
            value={formData.address}
            placeholder="Enter your address"
            icon={<MapPin className="h-5 w-5" />}
            error={errors.address}
            onChange={(value) => handleInputChange('address', value)}
            onBlur={(value) => {
              const addressError = validateRequired(value, 'Address');
              if (addressError) {
                setFieldError('address', addressError);
              }
            }}
          />

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="h-4 w-4" />
            Update Profile
          </button>
        </form>
      </div>

      <div className="max-w-2xl space-y-2">
        <h2 className="text-xl font-semibold text-white tracking-tight">Security</h2>
        <p className="text-slate-400 text-sm">
          Change password (UI only — your password is not checked or saved on any server.)
        </p>
      </div>

      <div className="max-w-2xl">
        <form
          onSubmit={(e) => handlePasswordFormSubmit(e, showToast)}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6"
        >
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Strong password checklist</h3>
            <p className="text-xs text-slate-500 mb-3">
              Rules apply to your new password after trimming spaces from the ends.
            </p>
            <ul className="space-y-2" aria-live="polite">
              <li
                className={`flex items-center gap-2 text-sm ${ruleChecklist.lengthAtLeast12 ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {ruleChecklist.lengthAtLeast12 ? (
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                )}
                At least 12 characters
              </li>
              <li
                className={`flex items-center gap-2 text-sm ${ruleChecklist.hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {ruleChecklist.hasUppercase ? (
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                )}
                One uppercase letter (A–Z)
              </li>
              <li
                className={`flex items-center gap-2 text-sm ${ruleChecklist.hasLowercase ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {ruleChecklist.hasLowercase ? (
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                )}
                One lowercase letter (a–z)
              </li>
              <li
                className={`flex items-center gap-2 text-sm ${ruleChecklist.hasDigit ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {ruleChecklist.hasDigit ? (
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                )}
                One number (0–9)
              </li>
              <li
                className={`flex items-center gap-2 text-sm ${ruleChecklist.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {ruleChecklist.hasSpecial ? (
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                )}
                One special character from the documented ASCII set
              </li>
            </ul>
          </div>

          <PasswordFormField
            id="current-password"
            label="Current password"
            value={currentPassword}
            placeholder="Enter your current password"
            icon={<Lock className="h-5 w-5" />}
            error={passwordErrors.currentPassword}
            onChange={handleCurrentPasswordChange}
          />

          <PasswordFormField
            id="new-password"
            label="New password"
            value={newPassword}
            placeholder="Choose a strong password"
            icon={<KeyRound className="h-5 w-5" />}
            error={passwordErrors.newPassword}
            onChange={handleNewPasswordChange}
          />

          <PasswordFormField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            placeholder="Re-enter your new password"
            icon={<Lock className="h-5 w-5" />}
            error={passwordErrors.confirmPassword}
            onChange={handleConfirmPasswordChange}
          />

          <button
            type="submit"
            disabled={!isPasswordFormValid}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Change password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
