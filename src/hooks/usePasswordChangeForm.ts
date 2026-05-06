import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

/**
 * All password validation and comparisons use trimmed values.
 * Whitespace-only input is treated as empty (required checks fail).
 */
export function normalizePasswordInput(s: string): string {
  return s.trim();
}

/**
 * Single fixed ASCII set for the special-character rule (V-8). One implementation path: membership test.
 * Includes: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
 */
export const PASSWORD_SPECIAL_CHAR_SET = '!"#$%&\'()*+,-./:;<=>?@[\\]^_\`{|}~';

function passwordHasSpecialChar(trimmed: string): boolean {
  for (let i = 0; i < trimmed.length; i += 1) {
    if (PASSWORD_SPECIAL_CHAR_SET.includes(trimmed[i])) return true;
  }
  return false;
}

export interface PasswordChangeFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface PasswordRuleChecklist {
  lengthAtLeast12: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
}

export function usePasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<PasswordChangeFormErrors>({});

  const trimmedCurrent = normalizePasswordInput(currentPassword);
  const trimmedNew = normalizePasswordInput(newPassword);
  const trimmedConfirm = normalizePasswordInput(confirmPassword);

  const ruleChecklist: PasswordRuleChecklist = useMemo(() => {
    const n = trimmedNew;
    return {
      lengthAtLeast12: n.length >= 12,
      hasUppercase: /[A-Z]/.test(n),
      hasLowercase: /[a-z]/.test(n),
      hasDigit: /[0-9]/.test(n),
      hasSpecial: passwordHasSpecialChar(n),
    };
  }, [trimmedNew]);

  const isFormValid = useMemo(() => {
    if (trimmedCurrent === '') return false;
    if (trimmedNew === '') return false;
    if (trimmedConfirm === '') return false;
    if (!ruleChecklist.lengthAtLeast12) return false;
    if (!ruleChecklist.hasUppercase) return false;
    if (!ruleChecklist.hasLowercase) return false;
    if (!ruleChecklist.hasDigit) return false;
    if (!ruleChecklist.hasSpecial) return false;
    if (trimmedNew !== trimmedConfirm) return false;
    if (trimmedNew === trimmedCurrent) return false;
    return true;
  }, [trimmedCurrent, trimmedNew, trimmedConfirm, ruleChecklist]);

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    setErrors((prev) => ({ ...prev, currentPassword: undefined }));
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setErrors((prev) => ({ ...prev, newPassword: undefined }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    showToast: (message: string, type: 'success' | 'error') => void
  ) => {
    e.preventDefault();

    const next: PasswordChangeFormErrors = {};

    if (trimmedCurrent === '') {
      next.currentPassword = 'Current password is required.';
    }

    if (trimmedNew === '') {
      next.newPassword = 'New password is required.';
    } else {
      if (trimmedNew.length < 12) {
        next.newPassword = 'Password must be at least 12 characters.';
      } else if (!/[A-Z]/.test(trimmedNew)) {
        next.newPassword = 'Password must include an uppercase letter.';
      } else if (!/[a-z]/.test(trimmedNew)) {
        next.newPassword = 'Password must include a lowercase letter.';
      } else if (!/[0-9]/.test(trimmedNew)) {
        next.newPassword = 'Password must include a number.';
      } else if (!passwordHasSpecialChar(trimmedNew)) {
        next.newPassword = 'Password must include a special character.';
      } else if (trimmedNew === trimmedCurrent) {
        next.newPassword = 'New password must be different from your current password.';
      }
    }

    if (trimmedConfirm === '') {
      next.confirmPassword = 'Please confirm your new password.';
    } else if (trimmedNew !== trimmedConfirm) {
      next.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    showToast('Password requirements met. Changes are not saved (demo only).', 'success');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    errors,
    isFormValid,
    ruleChecklist,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  };
}
