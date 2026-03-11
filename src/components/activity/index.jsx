import { useEffect, useState } from "react";
import { apiUrls } from "../../Constant/apiUrls";
import { useIsLoggedIn } from "../../Context/LoggedInContext";
import useGetApi from "../../Hooks/useGetApi";
import Pagination from "../../utils/Helper/Pagination";
import "./Activity.scss";
import { formatHours, formatPlanWithTooltip, formatTimestamp, toFirstCapital } from "../../utils/Helper/CommonHelper";
import InnerLoader from "../../Common/Loader/InnerLoader";

function Activity() {
  const [activityList, setActivityList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const { authData } = useIsLoggedIn();
  const [tokenPrice, setTokenPrice] = useState(null);


  const getTokenPrice = async () => {
    try {
      const response = await fetch(`${env.ticsApi}${apiUrls.getCurrentTokenPrice}`);
      const data = await response.json();
      setTokenPrice(data?.data?.current_token_price ?? null);
    } catch {
      setTokenPrice(1);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const { success, data } = await useGetApi(apiUrls.getActivityList(authData, page, limit));

    if (success) {
      setActivityList(data?.data?.activityList || []);
      setTotal(data?.data?.count || 0);
      setTotalPages(data?.data?.count ? Math.ceil(data.data.count / limit) : 1);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    getTokenPrice();
  }, [page, limit]);

  return (
    <div className="node">
      <div className="node__header">
        <h3>Request History</h3>
      </div>

      <div className="custom-table-wrapper commonTable node-table">
        <div className="outerTable">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Request Type</th>
                <th>Status</th>
                <th>Plan</th>
                <th>Plan Duration</th>
                <th>Bandwidth</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={100}>
                    <InnerLoader />
                  </td>
                </tr>
              ) : !activityList?.length ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                activityList?.map((row, i) => {
                  const { formatted, tooltip } = formatPlanWithTooltip(row?.metaData?.plan,tokenPrice);

                  return (
                    <tr key={i}>
                      <td>{toFirstCapital(row?.providerName) || "-"}</td>
                      <td>{row?.type ?? "-"}</td>
                      <td className={row?.action?.toLowerCase() || ""}>{toFirstCapital(row?.action)}</td>
                      <td title={tooltip}>{formatted}</td>
                      <td>{formatHours(row?.metaData?.hours)}</td>
                      <td>{row?.metaData?.bandwidth ?? "0"} GB</td>
                      <td>{formatTimestamp(row?.createdAt) ?? "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 5 && !isLoading && (
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
