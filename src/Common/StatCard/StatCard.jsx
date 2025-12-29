const StatCard = ({ icon, label, value }) => {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>
      <div className="stat-card-right">
        <p className="label">{label}</p>
        <h4 className="value">{value}</h4>
      </div>
    </div>
  );
};

export default StatCard;
