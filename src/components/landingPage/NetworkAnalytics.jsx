import axios from "axios";
import {
  // ActiveIcon,
  CountriesIcon,
  // DataConsumedICon,
  GroupUserIcon,
  NodesIcon,
  // UserIcon,
} from "../../assets/StoreAsset/StoreAsset";
import StatCard from "../../Common/StatCard/StatCard";
import "../../styles/components/landingPage/network-analytics.scss";
import { apiUrls } from "../../Constant/apiUrls";
import { useEffect, useState } from "react";
import { env } from "../../Constant/envConstants";
import { Col, Row } from "antd";

const NetworkAnalytics = () => {
  const [analytics, setAnalytics] = useState();
  const stats = [
    { label: "Total Countries", value: analytics?.total_country || "0", icon: <CountriesIcon /> },
    { label: "dVPN Nodes Online", value: analytics?.active_nodes || "0", icon: <NodesIcon /> },
    { label: "Total Users", value: analytics?.total_user || "0", icon: <GroupUserIcon /> },
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
          <h2>Network Analytics</h2>
        </div>

        <div className="stats-dashboard">
          <Row gutter={[25, 20]} className="card-row">
            {stats.map((stat, index) => (
              <Col className="gutter-row" lg={8} md={8} sm={12} xs={24}>
                <StatCard key={index} {...stat} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
};

export default NetworkAnalytics;
