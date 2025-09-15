import axios from "axios";
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
import { apiUrls } from "../../Constant/apiUrls";
import { useEffect, useState } from "react";
import { env } from "../../Constant/envConstants";

const NetworkAnalytics = () => {
  const [analytics, setAnalytics] = useState();
  const stats = [
    // { label: "User Online", value: analytics?.active_session|| "0", icon: <UserIcon /> },
    { label: "dVPN Nodes Online", value: analytics?.active_nodes|| "0", icon: <NodesIcon /> },
    { label: "Total Users", value: analytics?.total_user|| "0", icon: <GroupUserIcon /> },
    { label: "Total Countries", value: analytics?.total_country|| "0", icon: <CountriesIcon /> },
    // { label: "Active Countries", value: "56", icon: <ActiveIcon /> },
    // {
    //   label: "Total Data Consumed",
    //   value: "3.81 PB",
    //   icon: <DataConsumedICon />,
    // },
  ];

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${env.explorerApiUrl}${apiUrls.getNetworkAnalytics}`);
      if (!response.data.error) {
        setAnalytics(response.data.data); 
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();

  }, [])

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
