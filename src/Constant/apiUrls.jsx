export const apiUrls = {
  getAllPlan: (address) => `/api/v1/plans?address=${address}`,
  postNodeRequest: "/api/v1/node",
  getAllProviders: "/api/v1/provider",
  getProvidersWithPlans: "/api/v1/provider/active-plans",
  getNetworkAnalytics: "/qubetics/dvpn/analytics",
  getStatus: (walletAddress) => `/api/v1/node/status?wallet_address=${walletAddress}`,
  getActivityList: (address, page, limit) => `/api/v1/activity?address=${address}&page=${page}&limit=${limit}`,
  getLinkedNodeDetails: (walletAddress) => `/api/v1/node/linked-node-values?address=${walletAddress}`,
  getCurrentTokenPrice: "/current-token-price",
};
