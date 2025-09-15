import React, { useEffect, useState } from "react";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/register/style.scss";
import { NotificationModal } from "./ResponseTabs";
import useGetApi from "../../Hooks/useGetApi";
import { apiUrls } from "../../Constant/apiUrls";
import { apiMethods } from "../../Constant/constants";
import { toast } from "react-toastify";
import { useIsLoggedIn } from "../../Context/LoggedInContext";
import { computePubKey } from "../../utils/Helper/CommonHelper";
import { env } from "../../Constant/envConstants";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [planList, setPlanList] = useState([]);
  const { authData } = useIsLoggedIn();

  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [nodeAddress, setNodeAddress] = useState("");
  const [choosePlan, setChoosePlan] = useState("");
  const [chooseAction, setChooseAction] = useState("");
  const [messageModal, setMessageModal] = useState("");

  const chainId = env.chainId;

  const message = (success) =>
    success ? "Node request sent successfully!" : "Node request failed!";

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

  const getAllPlan = async () => {
    try {
      const result = await useGetApi(apiUrls.getAllPlan, apiMethods.GET);
      const list =
        result?.data?.data?.filter((item) => item.status === "active") || [];
      setPlanList(list);
    } catch (error) {
      toast.error(error?.message);
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
  };

  const postNodeRequest = async () => {
    if (!authData) return toast.error("Connect your wallet first");
    if (!nodeAddress.trim()) return toast.error("Node Address is required");
    if (chooseAction === "Link" && !choosePlan)
      return toast.error("Please choose a plan");
    if (!chooseAction)
      return toast.error("Please choose an action (Link/Unlink)");

    const signData = await handleSign();
    if (!signData) return;
    const { compubKey, pubKeyInitial, signature } = signData;

    const extendedPlan =
      chooseAction === "Link"
        ? {
            plan: `${choosePlan?.prices?.[0]?.quote_value} TICS/month`,
            planId: choosePlan?.id,
            provAddress: choosePlan?.prov_address,
            bandwidth: choosePlan?.gigabytes,
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
        setMessageModal(message(response?.success));
        setVisible(true);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getAllPlan();
  }, []);

  return (
    <div className="register-container">
      <div>
        <h1>Register as Node Operator</h1>
      </div>
      {/* Header */}
      <div className="stepper">
        <div className="step-item active">
          <div className="step-circle">1</div>
          <span className="step-label">Register Node</span>
        </div>
        <div className="step-line"></div>
        <div className="step-item">
          <div className="step-circle">2</div>
          <span className="step-label">Node Linked</span>
        </div>
      </div>

      <div className="register-content">
        {/* Left Panel */}
        <div className="register-left">
          <h2>Registration Process </h2>
          <div className="process-card">
            <h3>Step 1: Connect Keplr Wallet</h3>
            <div className="process-card_inner">
              Import your node address into Keplr and connect with the same
              wallet used during node setup. This ensures proper ownership
              validation and links your wallet address to the deployed node.
            </div>
          </div>
          <div className="process-card">
            <h3>Step 2: Details Required to become a Node Operator</h3>
            <div className="process-card_inner">
              <strong>Set Operator Name</strong>:
              <p>
                Assign a unique operator name. This acts as your node’s
                identifier within the ecosystem.
              </p>
              <br />
              <strong>Email Address</strong>:
              <p>
                Provide an email address to receive updates on approval,
                rejection, or any follow-up requests regarding your node
                registration.
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
                Input the node address generated by the setup script. This
                address is validated against your deployed node.
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
          <div className="form-group">
            <label>
              Request For <span className="astrick">*</span>
            </label>
            <select
              value={chooseAction}
              onChange={(e) => setChooseAction(e.target.value)}
            >
              <option value="">-- Select Action --</option>
              <option value="Link">Link Node</option>
              <option value="Unlink">Unlink Node</option>
            </select>
          </div>
          {chooseAction === "Link" && (
            <div className="form-group">
              <label>
                Choose Plan <span className="astrick">*</span>
              </label>
              <select
                value={choosePlan ? JSON.stringify(choosePlan) : ""}
                onChange={(e) =>
                  e.target.value !== "SELECT"
                    ? setChoosePlan(JSON.parse(e.target.value))
                    : setChoosePlan("")
                }
              >
                <option value="SELECT">-- Select a Plan --</option>
                {planList.map((plan) => (
                  <option key={plan.id} value={JSON.stringify(plan)}>
                    {plan.prices.length > 0
                      ? `${
                          plan.prices[0].quote_value
                        } ${plan.prices[0].denom.toUpperCase()}/month`
                      : `Plan ${plan.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              placeholder="Duration"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>{" "}
          <div className="form-group">
            <label>Bandwidth</label>
            <input
              type="text"
              placeholder="Bandwidth in bytes"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
