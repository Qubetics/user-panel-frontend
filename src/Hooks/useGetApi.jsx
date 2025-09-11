import axios from "axios";
import { apiMethods } from "../Constant/constants";
import { env } from "../Constant/envConstants";

const useGetApi = async (
    url,
    method,
    body,
    additionalHeaders,
    isIpfs = false
) => {
    try {
        const response = await axios({
            method: method || apiMethods.GET,
            url: env.baseApiUrls + url,
            data: body || undefined,
            withCredentials: !isIpfs,
            headers: additionalHeaders
        });

        return {
            success: true,
            data: response?.data,
            headers: { totalCount: response.headers["total"] },
            message: response.data.message || "Success",
          };
    } catch (error) {
        return {
            success: false,
            message: error?.message,
          };
    } 
};

export default useGetApi;