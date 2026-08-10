import { useState, FormEvent } from 'react';

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function usePasswordForm() {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<PasswordErrors>({});

  const isFormValid =
    formData.currentPassword.trim() !== '' &&
    formData.newPassword.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    PASSWORD_REGEX.test(formData.newPassword) &&
    formData.newPassword === formData.confirmPassword;

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateNewPassword = (value: string): string | undefined => {
    if (!value.trim()) return 'New password is required.';
    if (value.length < 8) return 'New password must be at least 8 characters.';
    if (!PASSWORD_REGEX.test(value)) return 'Password must include uppercase, lowercase, number, and special character.';
    return undefined;
  };

  const validateConfirmPassword = (value: string): string | undefined => {
    if (!value.trim()) return 'Please confirm your new password.';
    if (value !== formData.newPassword) return 'New password and confirm password must match.';
    return undefined;
  };

  const setFieldError = (field: keyof PasswordErrors, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (
    e: FormEvent,
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>,
    showToast: (message: string, type: 'success' | 'error') => void
  ) => {
    e.preventDefault();

    const newErrors: PasswordErrors = {};
    if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Current password is required.';
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters.';
    } else if (!PASSWORD_REGEX.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include uppercase, lowercase, number, and special character.';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'New password and confirm password must match.';
    }

    if (Object.keys(newErrors).length > 0) {
      Object.entries(newErrors).forEach(([field, error]) => {
        (setErrors as (fn: (prev: PasswordErrors) => PasswordErrors) => void)((prev) => ({ ...prev, [field]: error }));
      });
      return;
    }

    changePassword(formData.currentPassword, formData.newPassword).then((result) => {
      if (result) {
        showToast('Password updated successfully.', 'success');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
      } else {
        showToast('Current password is incorrect.', 'error');
      }
    });
  };

  return {
    formData,
    errors,
    isFormValid,
    handleInputChange,
    validateNewPassword,
    validateConfirmPassword,
    setFieldError,
    handleSubmit,
  };
}