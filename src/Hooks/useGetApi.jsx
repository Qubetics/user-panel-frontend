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
        const result = await axios({
            method: method || apiMethods.GET,
            url: env.baseApiUrls + url,
            data: body || undefined,
            withCredentials: !isIpfs,
            headers: additionalHeaders
        });
        return result; 
    } catch (error) {
        const { response } = error;
        const error_message = response?.data?.message || error?.message;
        message.error(error_message);
    } 
};

export default useGetApi;