import {
  ActiveIcon,
  CountriesIcon,
  DataConsumedICon,
  GroupUserIcon,
  NodesIcon,
  UserIcon,
} from "../../assets/StoreAsset/StoreAsset";
import StatCard from "../../Common/StatCard/StatCard";
import "../../styles/components/landingPage/network-analytics.scss";

const NetworkAnalytics = () => {
  const stats = [
    { label: "User Online", value: "4,330", icon: <UserIcon /> },
    { label: "dVPN Nodes Online", value: "4,394", icon: <NodesIcon /> },
    { label: "Total Users", value: "819,513", icon: <GroupUserIcon /> },
    { label: "Total Countries", value: "120", icon: <CountriesIcon /> },
    { label: "Active Countries", value: "56", icon: <ActiveIcon /> },
    {
      label: "Total Data Consumed",
      value: "3.81 PB",
      icon: <DataConsumedICon />,
    },
  ];

  return (
    <section className="network-analytics">
      <div className="network-analytics__container">
        <div className="network-analytics__header">
          <h2 className="common-heading">Network Analytics</h2>
        </div>

        <div className="stats-dashboard">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NetworkAnalytics;
