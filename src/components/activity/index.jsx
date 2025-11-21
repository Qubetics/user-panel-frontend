import { useEffect, useState } from "react";
import { apiUrls } from "../../Constant/apiUrls";
import { useIsLoggedIn } from "../../Context/LoggedInContext";
import useGetApi from "../../Hooks/useGetApi";
import Pagination from "../../utils/Helper/Pagination";
import "./Activity.scss";
import { formatTimestamp } from "../../utils/Helper/CommonHelper";

function Activity() {
  const [activityList, setActivityList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const { authData } = useIsLoggedIn();

  const fetchData = async () => {
    const { success, data } = await useGetApi(apiUrls.getActivityList(authData, page, limit));
    if (!success) return;

    setActivityList(data?.data?.activityList);
    setTotalPages(data?.data?.count ? Math.ceil(data?.data?.count / limit) : 1);
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return (
    <div className="node">
      <div className="node__header">
        <h3>Transaction History</h3>
      </div>

      <div className="custom-table-wrapper commonTable node-table">
        <div className="outerTable">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Request Type</th>
                <th>Timestamp</th>
                <th>Plan</th>
                <th>Plan Duration</th>
                <th>Bandwidth</th>
              </tr>
            </thead>
            <tbody>
              {!activityList?.length ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                activityList?.map((row, i) => (
                  <tr key={i}>
                    <td>{row?.providerName ?? "-"}</td>
                    <td>{row?.type ?? "-"}</td>
                    <td>{formatTimestamp(row?.createdAt) ?? "-"}</td>
                    <td>{row?.metaData?.plan ?? "-"}</td>
                    <td>{row?.metaData?.hours ?? "0"}</td>
                    <td>{row?.metaData?.bandwidth ?? "0"} GB</td>
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
