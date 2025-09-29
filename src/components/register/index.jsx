import React, { useEffect, useState } from "react";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/register/style.scss";
import { NotificationModal } from "./ResponseTabs";
import useGetApi from "../../Hooks/useGetApi";
import { apiUrls } from "../../Constant/apiUrls";
import {
  apiMethods,
  emailRegex,
  NODE_FAILED,
  NODE_REQUEST,
} from "../../Constant/constants";
import { toast } from "react-toastify";
import { useIsLoggedIn } from "../../Context/LoggedInContext";
import {
  computePubKey,
  formatDuration,
  getValueWithUnit,
  progressbar,
} from "../../utils/Helper/CommonHelper";
import { env } from "../../Constant/envConstants";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [planList, setPlanList] = useState([]);
  const { authData, status, request } = useIsLoggedIn();

  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [nodeAddress, setNodeAddress] = useState("");
  const [choosePlan, setChoosePlan] = useState("");
  const [chooseAction, setChooseAction] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const [duration, setDuration] = useState("");
  const [bandwidth, setBandwidth] = useState("");

  const chainId = env.chainId;
  const [activeline, setActiveline] = useState();
  const message = (success) => (success ? NODE_REQUEST : NODE_FAILED);

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

  const handlePlanChange = (e) => {
    if (e.target.value !== "SELECT") {
      const plan = JSON.parse(e.target.value);
      setChoosePlan(plan);
      setBandwidth(
        Math.round(plan?.gigabytes / (1024 * 1024 * 1024)) + " GB" || ""
      );
      setDuration(formatDuration(plan?.hours));
    } else {
      setChoosePlan("");
      setBandwidth("");
      setDuration("");
    }
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
    try {
      const result = await useGetApi(apiUrls.getAllPlan, apiMethods.GET);
      const list =
        result?.data?.data?.filter((item) => item.status === "active") || [];
      setPlanList(list);
    } catch (error) {
      cpnsole.error(error?.message);
    }
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
    if (!nodeAddress.trim()) return toast.error("Node Address is required");
    if (chooseAction === "Link" && !choosePlan)
      return toast.error("Please choose a plan");
    if (!chooseAction) return toast.error("Please choose an action");
    if (email) {
      if (!emailRegex.test(email)) {
        return toast.error("Please enter the valid email address");
      }
    }
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
      emailAddress: email || undefined,
      nodeAddress,
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
    getAllPlan();
  }, []);

  useEffect(() => {
    if (authData) {
      progressbarAction();
    }
  }, [authData, status, request]);
  console.log(
    env,
    import.meta.env.VITE_GITBOOK_LINK,
    "import.meta.env.VITE_GITBOOK_LINK"
  );
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
            <h3>Step 1: How to install</h3>
            <div className="process-card_inner">
              <a
                href={import.meta.env.VITE_GITBOOK_LINK}
                target="_blank"
                rel="noopener"
              >
                Gitbook link
              </a>
            </div>
          </div>
          <div className="process-card">
            <h3>Step 2: Connect Keplr Wallet</h3>
            <div className="process-card_inner">
              Import your node wallet into Keplr and connect with the same
              wallet used during node setup. This ensures proper ownership
              validation and links your wallet address to the deployed node.
            </div>
          </div>
          <div className="process-card">
            <h3>Step 3: Details Required to become a Node Operator</h3>
            <div className="process-card_inner">
              <strong>Set Operator Name</strong>:
              <p>
                Assign a unique operator name is optional.If you choose to add
                one,this acts as your node’s identifier within the ecosystem.
              </p>
              <br />
              <strong>Email Address</strong>:
              <p>
                Provide an email address is optional.If you choose to add
                one,you'll receive updates on approval, rejection, or any
                follow-up requests regarding your node registration.
              </p>{" "}
              <br />
              <strong>Node Address</strong>:
              <p>
                Input the node address provided after you launch the node. The
                system will validate this address with your deployed node.
              </p>{" "}
              <br />
              <strong>Request Type</strong>:
              <p>
                Choose whether you want to send a request to link your node to
                the provider’s ecosystem or to unlink an existing node from it.
              </p>{" "}
              <br />
              <strong>Choose Plan</strong>:
              <p>
                when choose a hosting plan from Qubetics, each plan comes with
                predefined bandwidth, duration, and platform fees. Once you
                select a plan, these details are automatically applied to your
                node, so you don’t need to set them manually.
              </p>{" "}
              <br />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="register-right">
          <h2>Join Qubetics dVPN</h2>
          <div className="form-group">
            <label>Operator Name</label>
            <input
              type="text"
              placeholder="Enter operator name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              Node Address <span className="astrick">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter node address"
              value={nodeAddress}
              onChange={(e) => setNodeAddress(e.target.value)}
            />
          </div>
          <div className="form-group ">
            <label>
              Request Type <span className="astrick">*</span>
            </label>
            <div className="custom-select">
              <select value={chooseAction} onChange={handleLinkChange}>
                <option value="">-- Select Action --</option>
                <option value="Link">Link Node</option>
                <option value="Unlink">Unlink Node</option>
              </select>
            </div>
          </div>
          {chooseAction === "Link" && (
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
            <ButtonCustom regularBtn label="Submit" onClick={postNodeRequest} />
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
