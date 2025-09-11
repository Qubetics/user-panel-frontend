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
  const [status, setStatus] = useState("success");
  const [planList, setPlanList] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { authData, setAuthData } = useIsLoggedIn();
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [nodeAddress, setNodeAddress] = useState("");
  const [choosePlan, setChoosePlan] = useState("");
  const [chooseAction, setChooseAction] = useState("");
  const [messageModal,setMessageModal] = useState("");

  const chainId = env.chainId;

  const message = (success) => {
    return success
      ? "Node request sent successfully!"
      : "Node request failed!";
  };

  const handleClick = () => {
    setVisible(true);

  };

  const handleSign = async () => {
    try {

      const message = authData; // OR use any unique string, like a nonce

      const result = await window.keplr.signArbitrary(
        chainId,
        authData,
        message
      );

      const { signature, pub_key } = result;


      // 🔐 Compute the public key from signature
      const pubKeyFromSignature = computePubKey(authData, signature, message);

      if (!pubKeyFromSignature) {
        console.log("Could not compute public key from signature.");
        return;
      }

      // Log or display for dev/debug purposes
      return {
        compubKey: pubKeyFromSignature,
        pubKeyInitial: pub_key,
        signature: signature
      }
    } catch (error) {
      console.error('Signing failed:', error);
    } finally {
    }
  };

  const getAllPlan = async () => {
    try {
      setIsLoading(false);
      const result = await useGetApi(
        apiUrls.getAllPlan,
        apiMethods.GET
      );
      setPlanList(result?.data?.data);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () =>{
    setVisible(false);
    setOrgName("");
    setChooseAction("");
    setEmail("");
    setChoosePlan("");
    setNodeAddress("");
    setMessageModal("");
  }

  const postNodeRequest = async () => {
    try {
      // check the nodeAddress should not be empty and plan 
      if (!nodeAddress) {
        toast.error("Node Address is required");
        return;
      }

      if (!choosePlan) {
        toast.error("Please choose a plan");
        return;
      }

      const { compubKey, pubKeyInitial, signature } = await handleSign();

      const extendedPlan = {
        plan: `${choosePlan?.prices?.[0]?.quote_value} TICS/month`,
        planId: choosePlan?.id,
        provAddress: choosePlan?.prov_address,
        bandwidth: choosePlan?.gigabytes,
      };


      const body = {
        orgName: orgName || undefined,
        emailAddress: email || undefined,
        nodeAddress,
        choosePlan: extendedPlan,
        address: authData,
        pubKey: compubKey,
        signature: {
          pub_key: pubKeyInitial,
          signature: signature
        },
        request: chooseAction
      };


      const response = await useGetApi(
        apiUrls.postNodeRequest,             // endpoint (appended to baseApiUrl)
        apiMethods.POST,      // method
        body,                 // body for POST request
        { "Content-Type": "application/json" } // headers
      );

      if (response) {
        const notificationMessage=message(response?.success);
        setMessageModal(notificationMessage);
        setVisible(true);
      }

    } catch (error) {
      toast.error(error?.message);
    }
  }

  useEffect(() => {
    getAllPlan();
  }, []);

  return (
    <div className="register-overlay">
      <div className="register-popup">
        <h2 className="register-popup__title">Register as Node Service</h2>

        <div className="register-popup__form">
          <label className="register-popup__label">Org Name</label>
          <input
            type="text"
            className="register-popup__input"
            placeholder="Enter Organization Name"
            value={orgName}
            onChange={(e) => { setOrgName(e.target.value) }}
          />
          <label className="register-popup__label">Email Address</label>
          <input
            type="text"
            className="register-popup__input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="register-popup__label">Node Address</label>
          <input
            type="text"
            className="register-popup__input"
            placeholder="Enter Node Address"
            value={nodeAddress}
            onChange={(e) => setNodeAddress(e.target.value)}
          />
          <label className="register-popup__label">Choose Plan</label>
          <select
            name="plan"
            id="plan"
            className="register-popup__select"
            value={choosePlan ? JSON.stringify(choosePlan) : ""}
            onChange={(e) => {
              if (JSON.parse(e.target.value) !== "SELECT") {
                setChoosePlan(JSON.parse(e.target.value))
              } else {
                setChoosePlan("");
              }
            }}
          >
            <option value={JSON.stringify("SELECT")}>-- Select a Plan --</option>
            {Array.isArray(planList) &&
              planList.map((plan) => (
                <option key={plan.id} value={JSON.stringify(plan)}>
                  {plan.prices.length > 0
                    ? `${plan.prices[0].quote_value} ${plan.prices[0].denom.toUpperCase()}/month`
                    : `Plan ${plan.id}`}
                </option>
              ))}
          </select>
          <label className="register-popup__label">Choose Action</label>
          <select name="action" id='action'
            className="register-popup__select"
            value={chooseAction}
            onChange={(e) => { setChooseAction(e.target.value) }}>
            <option value="">-- Select Action --</option>
            <option key={1} value={"Link"}>Link</option>
            <option key={2} value={"Unlink"}>Unlink</option>
          </select>
          <div className="register-popup__actions">
            <ButtonCustom
              regularBtn
              label="Submit"
              disabled={!authData}
              onClick={() => postNodeRequest()}
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
