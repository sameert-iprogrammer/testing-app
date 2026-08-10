import React, { useState } from 'react';
import { Plus, User, Mail, Users as UsersIcon } from 'lucide-react';
import { useToast } from '../components/Toast';
import { validateRequired, validateEmail } from '../hooks/useProfileForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Deactivated';
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'Inactive' },
  { id: '4', name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Manager', status: 'Active' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', status: 'Deactivated' },
];

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
  const styles: Record<User['status'], string> = {
    Active: 'bg-emerald-400/10 text-emerald-400',
    Inactive: 'bg-amber-400/10 text-amber-400',
    Deactivated: 'bg-rose-400/10 text-rose-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const UsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active' as User['status'],
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const isFormValid =
    newUser.name.trim() !== '' &&
    newUser.email.trim() !== '' &&
    newUser.role.trim() !== '' &&
    newUser.status.trim() !== '' &&
    !Object.values(errors).some(Boolean);

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateField = (field: string, value: string) => {
    if (field === 'email') {
      const error = validateEmail(value);
      if (error) setErrors((prev) => ({ ...prev, [field]: error }));
      return error;
    }
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
    const error = validateRequired(value, fieldName);
    if (error) setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleBlur = (field: string) => {
    const value = newUser[field as keyof typeof newUser] as string;
    validateField(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string | undefined> = {};

    const nameError = validateRequired(newUser.name, 'Name');
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(newUser.email);
    if (emailError) newErrors.email = emailError;
    else {
      const duplicate = users.find((u) => u.email === newUser.email.trim());
      if (duplicate) {
        newErrors.email = 'Email already exists';
      }
    }

    const roleError = validateRequired(newUser.role, 'Role');
    if (roleError) newErrors.role = roleError;

    const statusError = validateRequired(newUser.status, 'Status');
    if (statusError) newErrors.status = statusError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.email) {
        showToast(newErrors.email, 'error');
      }
      return;
    }

    const id = crypto.randomUUID() || Date.now().toString();
    setUsers((prev) => [...prev, { id, ...newUser }]);
    setNewUser({ name: '', email: '', role: '', status: 'Active' });
    setErrors({});
    setIsModalOpen(false);
    showToast('User added successfully.', 'success');
  };

  const handleCancel = () => {
    setNewUser({ name: '', email: '', role: '', status: 'Active' });
    setErrors({});
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
          <p className="text-slate-400">Manage and view all registered users.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center gap-2 px-4 py-2.5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="Registered users">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-200">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{user.role}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={handleCancel}
          aria-hidden="true"
        />
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel();
          }}
        >
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 id="modal-title" className="text-xl font-semibold text-white">
                Add New User
              </h2>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="new-user-name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="new-user-name"
                    type="text"
                    value={newUser.name}
                    onChange={(e) => handleNewUserChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Enter user name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'new-user-name-error' : undefined}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                {errors.name && (
                  <p id="new-user-name-error" className="text-rose-400 text-xs mt-1" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="new-user-email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="new-user-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => handleNewUserChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="Enter email address"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'new-user-email-error' : undefined}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                {errors.email && (
                  <p id="new-user-email-error" className="text-rose-400 text-xs mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="new-user-role" className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <select
                    id="new-user-role"
                    value={newUser.role}
                    onChange={(e) => handleNewUserChange('role', e.target.value)}
                    onBlur={() => handleBlur('role')}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm appearance-none"
                  >
                    <option value="">Select role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="text-rose-400 text-xs mt-1" role="alert">
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="new-user-status" className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <select
                    id="new-user-status"
                    value={newUser.status}
                    onChange={(e) => handleNewUserChange('status', e.target.value)}
                    onBlur={() => handleBlur('status')}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>
                {errors.status && (
                  <p className="text-rose-400 text-xs mt-1" role="alert">
                    {errors.status}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 px-4 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-800/50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;