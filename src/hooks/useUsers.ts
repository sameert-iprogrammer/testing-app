import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '../types/user';
import { useToast } from '../components/Toast';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Editor', status: 'Inactive' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'Active' },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' },
  { id: '8', name: 'Hank Wilson', email: 'hank@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '9', name: 'Ivy Chen', email: 'ivy@example.com', role: 'Admin', status: 'Active' },
  { id: '10', name: 'Jack Taylor', email: 'jack@example.com', role: 'Editor', status: 'Active' },
  { id: '11', name: 'Karen White', email: 'karen@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '12', name: 'Leo Martinez', email: 'leo@example.com', role: 'Admin', status: 'Active' },
  { id: '13', name: 'Mia Garcia', email: 'mia@example.com', role: 'Editor', status: 'Active' },
  { id: '14', name: 'Noah Robinson', email: 'noah@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '15', name: 'Olivia Clark', email: 'olivia@example.com', role: 'Admin', status: 'Active' },
  { id: '16', name: 'Paul Lewis', email: 'paul@example.com', role: 'Editor', status: 'Inactive' },
  { id: '17', name: 'Quinn Hall', email: 'quinn@example.com', role: 'Viewer', status: 'Active' },
  { id: '18', name: 'Rachel Adams', email: 'rachel@example.com', role: 'Admin', status: 'Active' },
  { id: '19', name: 'Sam Baker', email: 'sam@example.com', role: 'Editor', status: 'Active' },
  { id: '20', name: 'Tina Nelson', email: 'tina@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '21', name: 'Uma Patel', email: 'uma@example.com', role: 'Admin', status: 'Active' },
  { id: '22', name: 'Victor Kim', email: 'victor@example.com', role: 'Editor', status: 'Inactive' },
  { id: '23', name: 'Wendy Scott', email: 'wendy@example.com', role: 'Viewer', status: 'Active' },
  { id: '24', name: 'Xavier Young', email: 'xavier@example.com', role: 'Admin', status: 'Active' },
  { id: '25', name: 'Yara King', email: 'yara@example.com', role: 'Editor', status: 'Active' },
  { id: '26', name: 'Zach Wright', email: 'zach@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '27', name: 'Amy Lopez', email: 'amy@example.com', role: 'Admin', status: 'Active' },
  { id: '28', name: 'Brian Hill', email: 'brian@example.com', role: 'Editor', status: 'Inactive' },
  { id: '29', name: 'Cindy Rivera', email: 'cindy@example.com', role: 'Viewer', status: 'Active' },
  { id: '30', name: 'Derek Foster', email: 'derek@example.com', role: 'Admin', status: 'Active' },
];

interface SortConfig {
  key: keyof User;
  direction: 'asc' | 'desc';
}

export default function useUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const shouldFail = Math.random() < 0.05;
      if (shouldFail) {
        setError('Failed to load users.');
        showToast('Failed to load users. Please try again.', 'error');
        setUsers([]);
      } else {
        setUsers(MOCK_USERS);
        showToast('Users loaded successfully.', 'success');
      }
      setLoading(false);
    }, 600);
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const lower = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower),
    );
  }, [users, searchQuery]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const aVal = String(a[sortConfig.key]).toLowerCase();
      const bVal = String(b[sortConfig.key]).toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredUsers, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return {
    users,
    loading,
    error,
    filteredUsers: sortedUsers,
    paginatedUsers,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    currentPage,
    totalPages,
    pageSize,
    nextPage,
    prevPage,
    fetchUsers,
  };
}