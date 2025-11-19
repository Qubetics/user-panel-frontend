import { useEffect, useState } from "react";
import { apiUrls } from "../../Constant/apiUrls";
import { useIsLoggedIn } from "../../Context/LoggedInContext";
import useGetApi from "../../Hooks/useGetApi";
import Pagination from "../../utils/Helper/Pagination";
import "./Activity.scss";

function Activity() {
  const [nodeList, setNodeList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const { authData, status, request } = useIsLoggedIn();
  const [active] = useState("active");

  console.log(apiUrls.getActivityList(active, page, limit));
  const fetchData = async () => {
    console.log("hereeeeeee");

    const { success, data } = await useGetApi(apiUrls.getActivityList(authData, page, limit));
    if (!success) return;
    setNodeList(data?.data?.activityList);
    setTotalPages(data?.data?.total ? Math.ceil(data?.data?.total / limit) : 1);
  };

  const staticData = [
    {
      provider: "Antier",
      requestType: "Unlink",
      timestamp: "16s ago\nSept 28, 2024 04:14 am",
      plan: "-",
      duration: "-",
      bandwidth: "-",
    },
    {
      provider: "Qubetics",
      requestType: "Link",
      timestamp: "16s ago\nSept 28, 2024 04:14 am",
      plan: "1000 TICS/month",
      duration: "30 days",
      bandwidth: "800 GB",
    },
    {
      provider: "Qube",
      requestType: "Unlink",
      timestamp: "16s ago\nSept 28, 2024 04:14 am",
      plan: "-",
      duration: "-",
      bandwidth: "-",
    },
    {
      provider: "Harry",
      requestType: "Link",
      timestamp: "16s ago\nSept 28, 2024 04:14 am",
      plan: "1000 TICS/month",
      duration: "60 days",
      bandwidth: "1 GB",
    },
    // add more static rows as needed...
  ];

  useEffect(() => {
    fetchData();
  }, [page, limit, active]);

  return (
    <div className='node'>
      <div className='node__header'>
        <h3>Transaction History</h3>
      </div>

      <div className='custom-table-wrapper commonTable node-table'>
        <div className='outerTable'>
          <table className='custom-table'>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Request Type</th>
                <th>Timestamp</th>
                <th>Plan</th>
                <th>Duration</th>
                <th>Bandwidth</th>
              </tr>
            </thead>
            <tbody>
              {false ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                staticData?.map((row, i) => (
                  <tr key={i}>
                    <td>{row.provider ?? "-"}</td>
                    <td>{row.requestType ?? "-"}</td>
                    <td>{row.timestamp ?? "-"}</td>
                    <td>{row.plan ?? "-"}</td>
                    <td>{row.duration ?? "-"}</td>
                    <td>{row.bandwidth ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            limit={limit}
            onLimitChange={(limit) => {
              setLimit(limit), setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Activity;
