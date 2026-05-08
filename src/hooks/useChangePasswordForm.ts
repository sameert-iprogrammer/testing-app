import { useState } from 'react';

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * Validation rules:
 * - "Empty" / required checks use trim so whitespace-only counts as empty (matches button enablement).
 * - Length, strength, mismatch, and same-as-current use raw field values (no trim).
 * - Same-as-current uses case-sensitive strict equality on raw strings.
 */
const STRENGTH_OK = (value: string): boolean => {
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  return hasUpper && hasLower && hasDigit && hasSpecial;
};

function validateCurrentPasswordField(value: string): string | undefined {
  if (!value.trim()) return 'Current password is required';
  return undefined;
}

function validateNewPasswordField(value: string, currentPassword: string): string | undefined {
  if (!value.trim()) return 'New password is required';
  if (value.length < 8) return 'Password must be at least 8 characters long';
  if (!STRENGTH_OK(value)) {
    return 'Password must contain uppercase, lowercase, number and special character';
  }
  if (value === currentPassword) {
    return 'New password must be different from current password';
  }
  return undefined;
}

function validateConfirmPasswordField(
  confirm: string,
  newPassword: string
): string | undefined {
  if (!confirm.trim()) return 'Confirm password is required';
  if (confirm.trim() && newPassword.trim() && confirm !== newPassword) {
    return 'New password and confirm password do not match';
  }
  return undefined;
}

const emptyForm: ChangePasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function useChangePasswordForm() {
  const [formData, setFormData] = useState<ChangePasswordFormData>(emptyForm);
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allFieldsNonEmpty =
    formData.currentPassword.trim() !== '' &&
    formData.newPassword.trim() !== '' &&
    formData.confirmPassword.trim() !== '';

  const isChangePasswordSubmitEnabled = allFieldsNonEmpty && !isSubmitting;

  const handleInputChange = (field: keyof ChangePasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setFieldError = (field: keyof ChangePasswordErrors, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: keyof ChangePasswordFormData, value: string) => {
    const { currentPassword, newPassword } = formData;

    if (field === 'currentPassword') {
      const err = validateCurrentPasswordField(value);
      if (err) setFieldError('currentPassword', err);
      return;
    }

    if (field === 'newPassword') {
      const err = validateNewPasswordField(value, currentPassword);
      if (err) setFieldError('newPassword', err);
      return;
    }

    if (field === 'confirmPassword') {
      const err = validateConfirmPasswordField(value, newPassword);
      if (err) setFieldError('confirmPassword', err);
    }
  };

  const handleSubmit = (
    e: React.FormEvent,
    showToast: (message: string, type: 'success' | 'error') => void
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    const nextErrors: ChangePasswordErrors = {};

    const currentErr = validateCurrentPasswordField(formData.currentPassword);
    if (currentErr) nextErrors.currentPassword = currentErr;

    const newErr = validateNewPasswordField(formData.newPassword, formData.currentPassword);
    if (newErr) nextErrors.newPassword = newErr;

    const confirmErr = validateConfirmPasswordField(
      formData.confirmPassword,
      formData.newPassword
    );
    if (confirmErr) nextErrors.confirmPassword = confirmErr;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    showToast('Password changed successfully', 'success');
    setFormData(emptyForm);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    isChangePasswordSubmitEnabled,
    handleInputChange,
    setFieldError,
    handleBlur,
    handleSubmit,
  };
}
