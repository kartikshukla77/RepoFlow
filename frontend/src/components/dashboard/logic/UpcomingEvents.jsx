import React from "react";
import "../styles/upcomingEvents.css";

const UpcomingEvents = () => {
  return (
    <div className="sidebar-card events-card">
      <div className="sidebar-heading">
        <p className="section-label">STAY UPDATED</p>

        <h3>Upcoming Events</h3>
      </div>

      <ul>
        <li>
          <span className="event-dot"></span>

          <div>
            <strong>Tech Conference</strong>

            <p>Dec 15</p>
          </div>
        </li>

        <li>
          <span className="event-dot"></span>

          <div>
            <strong>Developer Meetup</strong>

            <p>Dec 25</p>
          </div>
        </li>

        <li>
          <span className="event-dot"></span>

          <div>
            <strong>React Summit</strong>

            <p>Jan 5</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UpcomingEvents;