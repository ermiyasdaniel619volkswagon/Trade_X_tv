
import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";

const TeamRoster = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "media_officer",
    department: "production",
    phoneNumber: "",
  });
  const { isDark } = useTheme();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("isActive", statusFilter);

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser._id}`, formData);
        toast.success("User updated successfully");
      } else {
        await api.post("/admin/users", formData);
        toast.success("User created successfully");
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "media_officer",
        department: "production",
        phoneNumber: "",
      });
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save user");
      console.error(error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
      phoneNumber: user.phoneNumber || "",
    });
    setShowForm(true);
  };

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}/toggle-active`);
      toast.success(
        `User ${user.isActive ? "deactivated" : "activated"} successfully`,
      );
      loadUsers();
    } catch (error) {
      toast.error("Failed to toggle user status");
      console.error(error);
    }
  };

  const handleChangeRole = async (user, newRole) => {
    if (user.role === newRole) return;

    if (
      !window.confirm(
        `Change ${user.firstName}'s role from ${user.role} to ${newRole}?`,
      )
    )
      return;

    try {
      await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      )
    )
      return;

    try {
      await api.delete(`/admin/users/${user._id}`);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      supervisor: isDark
        ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
        : "bg-purple-100 text-purple-700 border border-purple-200",
      media_officer: isDark
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200",
    };
    return (
      colors[role] ||
      (isDark
        ? "bg-slate-500/20 text-slate-400 border border-slate-500/20"
        : "bg-slate-100 text-slate-700 border border-slate-200")
    );
  };

  // Check if the user is the current logged-in user (by email)
  const isCurrentUser = (user) => {
    if (!currentUser || !user) return false;
    return currentUser.email?.toLowerCase() === user.email?.toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? "text-emerald-200/60" : "text-emerald-800/60"}>
            Loading team members...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Team Roster - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
                isDark ? "text-white" : "text-emerald-950"
              }`}
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiUsers className="text-white" size={24} />
              </div>
              Team Roster
            </h1>
            <p
              className={`text-sm mt-1 ${isDark ? "text-emerald-200/50" : "text-emerald-800/50"}`}
            >
              Manage team members, roles, and permissions
            </p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "media_officer",
                department: "production",
                phoneNumber: "",
              });
              setShowForm(!showForm);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <FiUserPlus size={18} />
            Add Member
          </button>
        </div>

        {/* Search and Filters */}
        <div
          className={`p-4 rounded-2xl ${
            isDark
              ? "bg-[#032e1d]/40 border border-white/5"
              : "bg-white/60 border border-emerald-100/50"
          } backdrop-blur-sm`}
        >
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-emerald-200/30" : "text-emerald-800/30"
                }`}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark
                  ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white"
                  : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950"
              }`}
            >
              <option value="">All Roles</option>
              <option value="media_officer">Media Officer</option>
              <option value="supervisor">Supervisor</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark
                  ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white"
                  : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950"
              }`}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button
              onClick={loadUsers}
              className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
                isDark
                  ? "border-white/10 text-emerald-200/60 hover:bg-white/5"
                  : "border-emerald-100 text-emerald-800/60 hover:bg-emerald-50"
              }`}
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Add/Edit User Form */}
        {showForm && (
          <div
            className={`p-6 rounded-2xl animate-slide-down ${
              isDark
                ? "bg-[#032e1d]/40 border border-white/5"
                : "bg-white/60 border border-emerald-100/50"
            } backdrop-blur-sm`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-emerald-950"}`}
            >
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
                required
                disabled={!!editingUser}
              />
              {!editingUser && (
                <input
                  type="password"
                  placeholder="Password (min 8 chars)"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark
                      ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                      : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                  }`}
                  required={!editingUser}
                  minLength={8}
                />
              )}
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950"
                }`}
              >
                <option value="media_officer">Media Officer</option>
                <option value="supervisor">Supervisor</option>
              </select>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950"
                }`}
              >
                <option value="production">Production</option>
                <option value="editing">Editing</option>
                <option value="broadcast">Broadcast</option>
                <option value="technical">Technical</option>
              </select>
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? "border-white/10 text-emerald-200/60 hover:bg-white/5"
                      : "border-emerald-100 text-emerald-800/60 hover:bg-emerald-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div
          className={`p-6 rounded-2xl overflow-x-auto ${
            isDark
              ? "bg-[#032e1d]/40 border border-white/5"
              : "bg-white/60 border border-emerald-100/50"
          } backdrop-blur-sm`}
        >
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <h3
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-emerald-950"}`}
              >
                No Users Found
              </h3>
              <p
                className={`text-sm mt-1 ${isDark ? "text-emerald-200/50" : "text-emerald-800/50"}`}
              >
                Start by adding your first team member.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`text-left border-b ${
                    isDark
                      ? "text-emerald-200/40 border-white/5"
                      : "text-emerald-800/40 border-emerald-100"
                  }`}
                >
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Role</th>
                  <th className="pb-3 pr-4 font-medium">Department</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Employee ID</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = isCurrentUser(user);

                  return (
                    <tr
                      key={user._id}
                      className={`border-b ${
                        isDark ? "border-white/5" : "border-emerald-100/50"
                      } hover:bg-white/5 transition-colors ${isSelf ? "bg-emerald-500/5" : ""}`}
                    >
                      {/* Name */}
                      <td className="py-3 pr-4 font-medium">
                        <div
                          className={`${isDark ? "text-white" : "text-emerald-950"} ${isSelf ? "flex items-center gap-2" : ""}`}
                        >
                          {user.firstName} {user.lastName}
                          {isSelf && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Email */}
                      <td
                        className={`py-3 pr-4 text-xs ${isDark ? "text-emerald-200/60" : "text-emerald-800/60"}`}
                      >
                        {user.email}
                      </td>

                      {/* Role - Disabled for self */}
                      <td className="py-3 pr-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleChangeRole(user, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-emerald-500 ${getRoleBadgeColor(user.role)} ${isSelf ? "opacity-60 cursor-not-allowed" : ""}`}
                          disabled={isSelf}
                        >
                          <option value="media_officer">Media Officer</option>
                          <option value="supervisor">Supervisor</option>
                        </select>
                      </td>

                      {/* Department */}
                      <td
                        className={`py-3 pr-4 text-xs capitalize ${isDark ? "text-emerald-200/60" : "text-emerald-800/60"}`}
                      >
                        {user.department}
                      </td>

                      {/* ============================================= */}
                      {/* STATUS - Supervisor: Show only text, no button */}
                      {/* ============================================= */}
                      <td className="py-3 pr-4">
                        {isSelf ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isDark
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(user)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              user.isActive
                                ? isDark
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                                : isDark
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:bg-rose-500/30"
                                  : "bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200"
                            }`}
                          >
                            {user.isActive ? (
                              <FiUserCheck size={12} />
                            ) : (
                              <FiUserX size={12} />
                            )}
                            {user.isActive ? "Active" : "Inactive"}
                          </button>
                        )}
                      </td>

                      {/* Employee ID */}
                      <td
                        className={`py-3 pr-4 text-xs ${isDark ? "text-emerald-200/40" : "text-emerald-800/40"}`}
                      >
                        {user.employeeId || "N/A"}
                      </td>

                      {/* ============================================= */}
                      {/* ACTIONS - Supervisor: Only Edit button (pencil) */}
                      {/* ============================================= */}
                      <td className="py-3">
                        {isSelf ? (
                          <div className="flex gap-1">
                            {/* Only Edit button for Supervisor */}
                            <button
                              onClick={() => handleEditUser(user)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                  ? "hover:bg-white/5 text-emerald-200/40 hover:text-white"
                                  : "hover:bg-emerald-100 text-emerald-800/40 hover:text-emerald-950"
                              }`}
                              title="Edit Profile"
                            >
                              <FiEdit2 size={15} />
                            </button>
                            {/* No Delete button */}
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditUser(user)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                  ? "hover:bg-white/5 text-emerald-200/40 hover:text-white"
                                  : "hover:bg-emerald-100 text-emerald-800/40 hover:text-emerald-950"
                              }`}
                              title="Edit User"
                            >
                              <FiEdit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                  ? "hover:bg-rose-500/10 text-emerald-200/40 hover:text-rose-400"
                                  : "hover:bg-rose-100 text-emerald-800/40 hover:text-rose-600"
                              }`}
                              title="Delete User"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamRoster;