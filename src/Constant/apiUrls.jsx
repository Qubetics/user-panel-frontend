export const apiUrls = {
    getAllPlan: "/api/v1/plans",
    postNodeRequest: "/api/v1/node",
    getNetworkAnalytics: "/qubetics/dvpn/analytics",
    getStatus: (walletAddress) => `/api/v1/node/status?wallet_address=${walletAddress}`
};
