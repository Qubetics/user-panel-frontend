import React, { useEffect, useState } from "react";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/register/style.scss";
import { NotificationModal } from "./ResponseTabs";
import useGetApi from "../../Hooks/useGetApi";
import { apiUrls } from "../../Constant/apiUrls";
import {
  apiMethods,
  APPROVED,
  emailRegex,
  emailfrontendRegex,
  NODE_FAILED,
  NODE_REQUEST,
  REJECTED,
  REQUEST_TYPE,
  STATUS,
  nameRegex,
  VALIDATION_MESSAGES,
} from "../../Constant/constants";
import { toast } from "react-toastify";
import { useIsLoggedIn } from "../../Context/LoggedInContext";
import {
  calculateBandwidth,
  computePubKey,
  formatDuration,
  getValueWithUnit,
  progressbar,
  toFirstCapital,
  truncateValue,
} from "../../utils/Helper/CommonHelper";
import { env } from "../../Constant/envConstants";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [planList, setPlanList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const { authData, status, request } = useIsLoggedIn();

  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [nodeAddress, setNodeAddress] = useState("");
  const [chooseProvider, setChooseProvider] = useState("");
  const [choosePlan, setChoosePlan] = useState("");
  const [chooseAction, setChooseAction] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const [duration, setDuration] = useState("");
  const [bandwidth, setBandwidth] = useState("");
  const [planLoading, setPlanLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const chainId = env.chainId;
  const [activeline, setActiveline] = useState();
  const message = (success) => (success ? NODE_REQUEST : NODE_FAILED);
  const autoFill =
    (status === APPROVED && request === REQUEST_TYPE.LINK) ||
    (status === REJECTED && request === REQUEST_TYPE.UNLINK);

  const handleSign = async () => {
    try {
      const result = await window.keplr.signArbitrary(
        chainId,
        authData,
        authData
      );
      const { signature, pub_key } = result;
      const pubKeyFromSignature = computePubKey(authData, signature, authData);
      if (!pubKeyFromSignature) return null;
      return {
        compubKey: pubKeyFromSignature,
        pubKeyInitial: pub_key,
        signature,
      };
    } catch (error) {
      console.error("Signing failed:", error);
      return null;
    }
  };

  const getNameError = () => {
    if (orgName.length > 0 && orgName.length < 3)
      return VALIDATION_MESSAGES.NAME_MIN_LENGTH;

    if (orgName.length > 50) return VALIDATION_MESSAGES.NAME_MAX_LENGTH;

    if (orgName.length > 0 && !nameRegex.test(orgName))
      return VALIDATION_MESSAGES.NAME_INVALID;

    return "";
  };

  const errorMessage = getNameError();

  const handlePlanChange = (e) => {
    if (e.target.value !== "SELECT") {
      const plan = JSON.parse(e.target.value);
      setChoosePlan(plan);
      setBandwidth(calculateBandwidth(plan));
      setDuration(formatDuration(plan?.hours));
    } else {
      setChoosePlan("");
      setBandwidth("");
      setDuration("");
    }
  };

  const handleProviderChange = (e) => {
    setChooseProvider(e.target.value);
    setChoosePlan("");
    setPlanList([]);
  };

  const handleLinkChange = (e) => {
    setChooseAction(e.target.value);
    if (e.target.value === "Unlink") {
      setChoosePlan("");
      setBandwidth("");
      setDuration("");
    }
  };

  const getAllPlan = async () => {
    setPlanLoading(true);
    const result = await useGetApi(
      apiUrls.getAllPlan(chooseProvider),
      apiMethods.GET
    );

    const list =
      result?.data?.data?.filter((item) => item.status === STATUS.ACTIVE) || [];

    const sortedList = [...list].sort((a, b) => {
      const aValue = a?.prices?.[0]?.quote_value || 0;
      const bValue = b?.prices?.[0]?.quote_value || 0;
      return bValue - aValue;
    });

    setPlanList(sortedList);
    setPlanLoading(false);
  };

  const getProviderList = async () => {
    const result = await useGetApi(
      apiUrls.getProvidersWithPlans,
      apiMethods.GET
    );
    setProviderList(result?.data?.data?.providers);
  };

  const getPrefillValues = async () => {
    const result = await useGetApi(
      apiUrls.getLinkedNodeDetails(authData),
      apiMethods.GET
    );
    setOrgName(result?.data?.data?.data?.orgName);
    setEmail(result?.data?.data?.data?.email);
    setNodeAddress(result?.data?.data?.data?.nodeAddress);
  };

  const handleClose = () => {
    setVisible(false);
    setOrgName("");
    setChooseAction("");
    setEmail("");
    setChoosePlan("");
    setNodeAddress("");
    setMessageModal("");
    setDuration("");
    setBandwidth("");
  };

  const postNodeRequest = async () => {
    if (!authData) return toast.error("Connect your wallet first");
    if (!orgName.trim()) return toast.error("Operator name is required");
    if (!nodeAddress.trim()) return toast.error("Node Address is required");
    if (chooseAction === "Link" && !choosePlan)
      return toast.error("Please choose a plan");
    if (!chooseAction) return toast.error("Please choose an action");
    // if (email) {
    //   if (!emailRegex.test(email)) {
    //     return toast.error("Please enter the valid email address");
    //   }
    // }
    const signData = await handleSign();
    if (!signData) {
      toast.error("User Rejected the Action");
      return;
    }
    const { compubKey, pubKeyInitial, signature } = signData;

    const extendedPlan =
      chooseAction === "Link"
        ? {
            plan: `${choosePlan?.prices?.[0]?.quote_value} TICS/month`,
            planId: choosePlan?.id,
            provAddress: choosePlan?.prov_address,
            bandwidth: choosePlan?.gigabytes,
            hours: choosePlan?.hours,
          }
        : null;

    const body = {
      orgName: orgName || undefined,
      emailAddress: email?.toLowerCase() || undefined,
      nodeAddress,
      providerAddress: chooseProvider,
      ...(chooseAction === "Link" && { choosePlan: extendedPlan }),
      address: authData,
      pubKey: compubKey,
      signature: { pub_key: pubKeyInitial, signature },
      request: chooseAction,
    };

    try {
      const response = await useGetApi(
        apiUrls.postNodeRequest,
        apiMethods.POST,
        body,
        {
          "Content-Type": "application/json",
        }
      );
      if (response) {
        setMessageModal(
          response?.success ? message(response?.success) : response?.message
        );
        setVisible(true);
      }
    } catch (error) {
      setMessageModal(error?.message);
      toast.error(error?.message);
    }
  };

  const progressbarAction = () => {
    const value = progressbar(status);
    setActiveline(value);
  };

  useEffect(() => {
    getProviderList();
  }, []);

  useEffect(() => {
    if (chooseProvider) {
      getAllPlan();
    }
  }, [chooseProvider]);

  useEffect(() => {
    if (authData) {
      progressbarAction();
    }
  }, [authData, status, request]);

  useEffect(() => {
    if (autoFill) {
      setChooseAction(REQUEST_TYPE.UNLINK);
      getPrefillValues();
    }
  }, [status]);

  const isFormValid =
    orgName.trim() !== "" &&
    nodeAddress.trim() !== "" &&
    chooseAction !== "" &&
    (chooseAction !== "Link" || choosePlan) &&
    isEmailValid;

  return (
    <div className="register-container">
      <div>
        <h3>Register as Node Operator</h3>
      </div>
      {/* Header */}
      <div className="stepper">
        <div className="step-item active">
          <div className="step-circle">1</div>
          <span className="step-label">Register Node</span>
        </div>
        <div className={`step-line ${activeline ? "active-line" : ""}`}></div>
        <div className={`step-item ${activeline ? "active" : ""}`}>
          <div className="step-circle">2</div>
          <span className="step-label">
            Node {request ? `${request}ed` : "Linked"}
          </span>
        </div>
      </div>

      <div className="register-content">
        {/* Left Panel */}
        <div className="register-left">
          <h2>Registration Process </h2>
          <div className="process-card">
            <div className="process-card_inner">
              <h3>
                Step 1: Run the script and follow the steps mentioned in{" "}
                <a
                  href={import.meta.env.VITE_GITBOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "white" }}
                >
                  gitbook
                </a>{" "}
                {/* <span style={{ color: "red" }}>*</span> */}
              </h3>
              <p>
                Run the provided setup script to initialize your own DVPN node.{" "}
                <a
                  href={import.meta.env.VITE_GITBOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block underline"
                  style={{ color: "white", textDecoration: "underline" }}
                >
                  Gitbook Link
                </a>
              </p>
              <p>
                After running the script, continue with <strong>Step 2</strong>{" "}
                and <strong>Step 3</strong> in the guide.
              </p>

              {/* <p>
                <a
                  href={import.meta.env.VITE_GITBOOK_LINK}
                  target="_blank"
                  rel="noopener"
                >
                  Gitbook link
                </a>
              </p>
              <p>After running the script follow the step 2 and step 3</p> */}
            </div>
          </div>
          <div className="process-card">
            <div className="process-card_inner">
              <h3>Step 2: Connect Keplr Wallet</h3>
              Import your node wallet into Keplr and connect with the same
              wallet used during node setup. This ensures proper ownership
              validation and links your wallet address to the deployed node.
            </div>
          </div>
          <div className="process-card">
            <div className="process-card_inner">
              <h3>Step 3: Details Required to become a Node Operator</h3>
              <strong>Set Operator Name</strong>
              <p>
                Assign a unique operator name. This acts as your node’s
                identifier within the ecosystem.
              </p>
              <br />
              <strong>Email Address</strong>
              <p>
                Providing an email address is optional however, if you choose to
                include it, you will receive updates regarding the status of
                your node registration.
              </p>{" "}
              <br />
              <strong>Node Address</strong>
              <p>
                Input the node address provided after you launch the node. The
                system will validate this address with your deployed node.
              </p>{" "}
              <br />
              <strong>Request Type</strong>
              <p>
                Choose whether you want to send a request to link your node to
                the provider’s ecosystem or to unlink an existing node from it.
              </p>{" "}
              <br />
              <strong>Choose Plan</strong>
              <p>
                When you choose a hosting plan, its predefined bandwidth,
                duration, and platform fees are automatically applied to your
                node, so no manual setup is needed.
              </p>{" "}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="register-right">
          <h2>Join Qubetics dVPN</h2>
          <div className="form-group">
            <label>
              Operator Name <span className="astrick">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter operator name"
              value={orgName}
              maxLength={50}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || nameRegex.test(value)) {
                  setOrgName(value);
                }
              }}
            />
            {errorMessage && (
              <p style={{ color: "red", marginTop: "4px" }}>{errorMessage}</p>
            )}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);

                if (value && !emailfrontendRegex.test(value)) {
                  setEmailError("Invalid email format");
                  setIsEmailValid(false);
                } else {
                  setEmailError("");
                  setIsEmailValid(true);
                }
              }}
            />
            {emailError && (
              <span
                style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}
              >
                {emailError}
              </span>
            )}
          </div>
          <div className="form-group">
            <label>
              Node Address <span className="astrick">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter node address"
              value={nodeAddress}
              maxLength={51}
              onChange={(e) => setNodeAddress(e.target.value)}
            />
            {nodeAddress.length > 0 && nodeAddress.length < 51 && (
              <p style={{ color: "red", marginTop: "4px" }}>
                Node address should be 51 characters
              </p>
            )}
          </div>
          <div className="form-group ">
            <label>
              Request Type <span className="astrick">*</span>
            </label>
            <div className="custom-select">
              <select value={chooseAction} onChange={handleLinkChange}>
                <option value="">-- Select Action --</option>
                <option
                  value="Link"
                  disabled={
                    status === APPROVED && request === REQUEST_TYPE.LINK
                  }
                >
                  Link Node
                </option>
                <option value="Unlink">Unlink Node</option>
              </select>
            </div>
          </div>
          {chooseAction === "Link" && (
            <div className="form-group">
              <label>
                Choose Provider <span className="astrick">*</span>
              </label>
              <div className="custom-select">
                <select
                  value={chooseProvider}
                  onChange={handleProviderChange}
                  disabled={planLoading}
                >
                  <option value="SELECT">-- Select a Provider --</option>
                  {providerList?.map((provider, index) => (
                    <option key={index} value={provider?.providerAddress}>
                      {truncateValue(provider?.providerAddress) +
                        ` (${toFirstCapital(provider?.name)})`}
                    </option>
                  ))}
                </select>
              </div>
              {planLoading && (
                <span className="astrick">
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                </span>
              )}
            </div>
          )}
          {chooseAction === "Link" && chooseProvider && !planLoading && (
            <div className="form-group">
              <label>
                Choose Plan <span className="astrick">*</span>
              </label>
              <div className="custom-select">
                <select
                  value={choosePlan ? JSON.stringify(choosePlan) : ""}
                  onChange={handlePlanChange}
                >
                  <option value="SELECT">-- Select a Plan --</option>
                  {planList.map((plan) => (
                    <option key={plan.id} value={JSON.stringify(plan)}>
                      {plan.prices.length > 0
                        ? `${getValueWithUnit(
                            plan.prices[0]?.quote_value
                          )} ${plan.prices[0].denom.toUpperCase()}/month`
                        : `Plan ${plan.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {choosePlan && chooseAction == "Link" && (
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                placeholder="Duration"
                value={duration}
                disabled={true}
                // onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}{" "}
          {choosePlan && chooseAction == "Link" && (
            <div className="form-group">
              <label>Bandwidth</label>
              <input
                type="text"
                placeholder="Bandwidth in bytes"
                value={bandwidth}
                disabled={true}
                // onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          <div className="form-actions">
            <ButtonCustom
              regularBtn
              label="Submit"
              onClick={postNodeRequest}
              disabled={!isFormValid}
              title="Required all fields"
            />
          </div>
        </div>
      </div>

      <NotificationModal
        title="Node Request"
        message={messageModal}
        onClose={handleClose}
        show={visible}
      />
    </div>
  );
};

export default Register;
