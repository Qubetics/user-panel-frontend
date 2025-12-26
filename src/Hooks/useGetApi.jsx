import axios from "axios";
import { apiMethods } from "../Constant/constants";
import { env } from "../Constant/envConstants";
import { toast } from "react-toastify";

const useGetApi = async (url, method, body, additionalHeaders, isIpfs = false) => {
  try {
    const response = await axios({
      method: method || apiMethods.GET,
      url: env.baseApiUrls + url,
      data: body || undefined,
      withCredentials: !isIpfs,
      headers: additionalHeaders,
    });

    return {
      success: true,
      data: response?.data,
      headers: { totalCount: response.headers["total"] },
      message: response.data.message || "Success",
    };
  } catch (error) {
    if (error?.response?.status === 429) {
      toast.error("Too many requests. Please try again later.", { toastId: "too-many-requests" });
    }
    return {
      success: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};

export default useGetApi;
