import React from "react";

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>
      <div className="stat-card-right">
        <p className="label">{label}</p>
        <h5 className="value">{value}</h5>
      </div>
    </div>
  );
};

export default StatCard;
