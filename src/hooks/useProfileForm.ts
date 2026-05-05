import { useState } from 'react';

export interface ProfileFormData {
  name: string;
  email: string;
  address: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
}

const mockProfile: ProfileFormData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  address: '221B Baker Street, London',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>(mockProfile);
  const [errors, setErrors] = useState<FormErrors>({});

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.address.trim() !== '' &&
    EMAIL_REGEX.test(formData.email);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required.';
    if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.';
    return undefined;
  };

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} is required.`;
    return undefined;
  };

  const setFieldError = (field: keyof FormErrors, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (
    e: React.FormEvent,
    showToast: (message: string, type: 'success' | 'error') => void
  ) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    showToast('Profile updated successfully.', 'success');
  };

  return {
    formData,
    errors,
    isFormValid,
    handleInputChange,
    validateEmail,
    validateRequired,
    setFieldError,
    handleSubmit,
  };
}
