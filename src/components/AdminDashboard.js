import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('organizer');
  const { currentUser } = useAuth();

  useEffect(() => {
    // TODO: Fetch users from Firebase
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // TODO: Implement Firebase fetch logic
    console.log('Fetching users...');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    // TODO: Implement user creation logic
    console.log('Adding user:', newUserEmail, newUserRole);
    setNewUserEmail('');
  };

  const handleDeleteUser = async (userId) => {
    // TODO: Implement user deletion logic
    console.log('Deleting user:', userId);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="add-user-section">
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <input
            type="email"
            placeholder="User Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
          />
          <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>

      <div className="users-list">
        <h3>Manage Users</h3>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
