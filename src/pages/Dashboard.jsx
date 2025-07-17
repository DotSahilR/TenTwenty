import React from "react";
import Navbar from "../components/Navbar";
import TimesheetTable from "../components/TimesheetTable";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 max-w-6xl">
        <TimesheetTable />
      </main>
    </div>
  );
};

export default Dashboard;
