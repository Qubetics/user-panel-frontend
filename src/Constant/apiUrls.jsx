export const apiUrls = {
  getAllPlan: (address) => `/api/v1/plans?address=${address}`,
  postNodeRequest: "/api/v1/node",
  getAllProviders: "/api/v1/provider",
  getProvidersWithPlans: "/api/v1/provider/active-plans",
  getNetworkAnalytics: "/qubetics/dvpn/analytics",
  getStatus: (walletAddress) => `/api/v1/node/status?wallet_address=${walletAddress}`,
  getLinkedNodeDetails: (walletAddress) => `/api/v1/node/linked-node-values?address=${walletAddress}`,
};
