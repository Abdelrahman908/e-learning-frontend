import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getStudentDashboard } from "../../services/dashboardService";
import DashboardCard from "./DashboardCard"; // Assuming we'll create this component
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentDashboard();
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorAlert message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorAlert message="No dashboard data available" />
      </div>
    );
  }

  const cardData = [
    { title: "My Courses", value: dashboardData.totalCourses, icon: "📚" },
    { title: "Total Lessons", value: dashboardData.totalLessons, icon: "📖" },
    { 
      title: "Completed Lessons", 
      value: dashboardData.completedLessons, 
      icon: "✅" 
    },
    { 
      title: "Progress", 
      value: `${dashboardData.progressPercentage}%`, 
      icon: "📈",
      isPercentage: true 
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your learning progress
        </p>
      </header>

      <section aria-labelledby="dashboard-stats">
        <h2 id="dashboard-stats" className="sr-only">
          Dashboard Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </section>
    </main>
  );
};

// Optional: Add prop types if you expect specific data structure
StudentDashboard.propTypes = {
  // Add any props if this component receives any
};

export default StudentDashboard;