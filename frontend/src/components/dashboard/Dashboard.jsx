import React from "react";
import Navbar from "../navbar/Navbar.jsx";
import Welcome from "./logic/Welcome.jsx";
import YourRepo from "./logic/YourRepo.jsx";
import SuggRepo from "./logic/SuggRepo.jsx";
import UpcomingEvents from "./logic/UpcomingEvents.jsx";
import "./styles/dashboard.css";


const Dashboard = () => {
  return (
    <>
      <Navbar />

      <div className="dashboard-page">
        <Welcome />

        <section id="dashboard">
          <YourRepo />
          <aside className="dashboard-sidebar">
            <SuggRepo />
            <UpcomingEvents />
          </aside>
        </section>
      </div>
    </>
  );
};

export default Dashboard;