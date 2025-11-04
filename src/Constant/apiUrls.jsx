export const apiUrls = {
  getAllPlan: (address) => `/api/v1/plans?address=${address}`,
  postNodeRequest: "/api/v1/node",
  getAllProviders: "/api/v1/provider",
  getNetworkAnalytics: "/qubetics/dvpn/analytics",
  getStatus: (walletAddress) => `/api/v1/node/status?wallet_address=${walletAddress}`,
};
