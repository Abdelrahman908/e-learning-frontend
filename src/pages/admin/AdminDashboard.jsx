import React from "react";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Users Management</h2>
          <p>Manage all users, roles, and permissions.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Courses Overview</h2>
          <p>View and manage all courses in the system.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Reports & Analytics</h2>
          <p>See reports and statistics about platform usage.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
