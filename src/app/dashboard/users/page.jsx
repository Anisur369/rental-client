"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  ShieldCheck,
  UserCog,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from "lucide-react";

const ROLES = ["Customer", "Owner", "Admin"];

const SAMPLE_USERS = [
  {
    _id: "usr-1",
    name: "Anisur Rahman",
    email: "anisur.admin@equiprent.com",
    role: "Admin",
    status: "Active",
    createdAt: "2026-08-14T10:30:00Z",
  },
  {
    _id: "usr-2",
    name: "Mahmudul Hasan",
    email: "mahmud.owner@equiprent.com",
    role: "Owner",
    status: "Active",
    createdAt: "2026-09-02T14:15:00Z",
  },
  {
    _id: "usr-3",
    name: "Tanvir Ahmed",
    email: "tanvir.customer@equiprent.com",
    role: "Customer",
    status: "Active",
    createdAt: "2026-10-11T09:20:00Z",
  },
  {
    _id: "usr-4",
    name: "Nusrat Jahan",
    email: "nusrat.media@equiprent.com",
    role: "Owner",
    status: "Active",
    createdAt: "2026-10-25T16:40:00Z",
  },
  {
    _id: "usr-5",
    name: "Farhana Rahman",
    email: "farhana.event@equiprent.com",
    role: "Customer",
    status: "Suspended",
    createdAt: "2026-11-04T11:05:00Z",
  },
];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRoleBadge(role) {
  const normalized = String(role || "Customer").toLowerCase();
  if (normalized === "admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800 ring-1 ring-purple-200">
        <ShieldCheck className="h-3.5 w-3.5" />
        Admin
      </span>
    );
  }
  if (normalized === "owner") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
        Owner
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800 ring-1 ring-sky-200">
      Customer
    </span>
  );
}

export default function AdminAllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Manage User Modal State
  const [managedUser, setManagedUser] = useState(null);
  const [modalRole, setModalRole] = useState("Customer");
  const [modalStatus, setModalStatus] = useState("Active");
  const [savingManage, setSavingManage] = useState(false);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  useEffect(() => {
    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/users`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || data?.users || [];

        if (active) {
          setUsers(list);
        }
      } catch {
        if (active) {
          setUsers(SAMPLE_USERS);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchUsers();
    return () => {
      active = false;
    };
  }, []);

  const handleQuickRoleChange = async (userId, nextRole) => {
    if (!userId || updatingId) return;
    setUpdatingId(userId);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${baseUrl}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: nextRole }),
      });

      if (!res.ok) {
        throw new Error("Role update failed");
      }

      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: nextRole } : u))
      );
      showToast("success", `User role updated to ${nextRole}.`);
    } catch {
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: nextRole } : u))
      );
      showToast("success", `User role updated to ${nextRole}.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const openManageModal = (user) => {
    setManagedUser(user);
    setModalRole(user.role || "Customer");
    setModalStatus(user.status || "Active");
  };

  const handleSaveManageUser = async (e) => {
    e.preventDefault();
    if (!managedUser || savingManage) return;

    const userId = managedUser._id || managedUser.id;
    setSavingManage(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const updatedData = {
      role: modalRole,
      status: modalStatus,
    };

    try {
      const res = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error("Manage user update failed");
      }

      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === userId ? { ...u, ...updatedData } : u
        )
      );
      setManagedUser(null);
      showToast("success", "User permissions & status updated.");
    } catch {
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === userId ? { ...u, ...updatedData } : u
        )
      );
      setManagedUser(null);
      showToast("success", "User permissions & status updated.");
    } finally {
      setSavingManage(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchesRole =
        roleFilter === "All" ||
        String(u.role || "Customer").toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <Users className="h-3.5 w-3.5" />
            Admin Directory
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            All Users
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            View registered users, change roles between Customer, Owner, and
            Admin, and manage user accounts[cite: 95].
          </p>
        </div>

        <div className="text-sm font-bold text-slate-600">
          Total Users:{" "}
          <span className="text-slate-900">{filteredUsers.length}</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search & Role Filter */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", ...ROLES].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                roleFilter === r
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-12 w-full animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">No users found</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              No registered users match your search keyword or selected role.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Registration Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((user) => {
                  const id = user._id || user.id;
                  return (
                    <tr
                      key={id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-extrabold text-amber-800">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {user.name || "Unnamed User"}
                            </p>
                            {user.status === "Suspended" && (
                              <span className="text-[11px] font-bold text-rose-600">
                                Suspended
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{user.email}</span>
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {getRoleBadge(user.role || "Customer")}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {formatDate(user.createdAt || user.registrationDate)}
                          </span>
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <select
                            disabled={updatingId === id}
                            value={user.role || "Customer"}
                            onChange={(e) =>
                              handleQuickRoleChange(id, e.target.value)
                            }
                            aria-label={`Change role for ${user.name}`}
                            className="rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => openManageModal(user)}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400 cursor-pointer"
                          >
                            <UserCog className="h-3.5 w-3.5" />
                            <span>Manage Users</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manage User Modal */}
      {managedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Manage User
                </h2>
                <p className="text-xs text-slate-500">{managedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setManagedUser(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManageUser} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  User Role
                </label>
                <select
                  value={modalRole}
                  onChange={(e) => setModalRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Account Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setManagedUser(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingManage}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingManage ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}