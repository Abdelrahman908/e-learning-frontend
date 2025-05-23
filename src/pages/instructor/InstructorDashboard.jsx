import React from "react";

const InstructorDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Instructor Dashboard</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">My Courses</h2>
          <p>Manage your created courses and lessons.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Student Progress</h2>
          <p>Track the progress of students enrolled in your courses.</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
