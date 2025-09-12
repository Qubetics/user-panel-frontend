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
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("success");
  const [planList, setPlanList] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { authData, setAuthData } = useIsLoggedIn();
  const [messageModal, setMessageModal] = useState("");

  const chainId = env.chainId;

  const message = (success) => {
    return success ? "Node request sent successfully!" : "Node request failed!";
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
        signature: signature,
      };
    } catch (error) {
      console.error("Signing failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPlan = async () => {
    try {
      setIsLoading(false);
      const result = await useGetApi(apiUrls.getAllPlan, apiMethods.GET);
      setPlanList(result?.data?.data);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      orgName: "",
      email: "",
      nodeAddress: "",
      choosePlan: "",
      chooseAction: "",
    },
    validationSchema: Yup.object({
      orgName: Yup.string().required("Organization name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      nodeAddress: Yup.string().required("Node Address is required"),
      choosePlan: Yup.string().required("Please choose a plan"),
      chooseAction: Yup.string().required("Please choose an action"),
    }),
    onSubmit: async (values) => {
      await postNodeRequest(values);
    },
  });

  const postNodeRequest = async (values) => {
    const { orgName, email, nodeAddress, choosePlan, chooseAction } = values;
    try {
      if (!authData) {
        toast.error("Connect your wallet first");
        return;
      }

      // check the nodeAddress should not be empty and plan
      // if (!nodeAddress.trim()) {
      //   toast.error("Node Address is required");
      //   return;
      // }

      // 5️⃣ Plan selection validation
      // if (!choosePlan) {
      //   toast.error("Please choose a plan");
      //   return;
      // }

      // 6️⃣ Action selection validation
      // if (!chooseAction) {
      //   toast.error("Please choose an action (Link/Unlink)");
      //   return;
      // }

      const { compubKey, pubKeyInitial, signature } = await handleSign();
      const choosePlanObj = JSON.parse(choosePlan);
      const extendedPlan = {
        plan: `${choosePlanObj?.prices?.[0]?.quote_value} TICS/month`,
        planId: choosePlanObj?.id,
        provAddress: choosePlanObj?.prov_address,
        bandwidth: choosePlanObj?.gigabytes,
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
          signature: signature,
        },
        request: chooseAction,
      };

      const response = await useGetApi(
        apiUrls.postNodeRequest, // endpoint (appended to baseApiUrl)
        apiMethods.POST, // method
        body, // body for POST request
        { "Content-Type": "application/json" } // headers
      );

      if (response) {
        const notificationMessage = message(response?.success);
        setMessageModal(notificationMessage);
        setVisible(true);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };
  const handleClose = () => {
    formik.resetForm();
    // setVisible(false);
    // setOrgName("");
    // setChooseAction("");
    // setEmail("");
    // setChoosePlan("");
    // setNodeAddress("");
    // setMessageModal("");
  };

  useEffect(() => {
    getAllPlan();
  }, []);

  return (
    <div className="register-overlay">
      <div className="register-popup">
        <h2 className="register-popup__title">Register as Node Service</h2>

        <form className="register-popup__form" onSubmit={formik.handleSubmit}>
          {/* Org Name */}
          <div className="field">
            <label className="register-popup__label">Org Name</label>
            <input
              type="text"
              name="orgName"
              className="register-popup__input"
              placeholder="Enter Organization Name"
              value={formik.values.orgName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.orgName && formik.errors.orgName && (
              <p className="error-message">{formik.errors.orgName}</p>
            )}
          </div>

          {/* Email */}
          <div className="field">
            <label className="register-popup__label">Email Address</label>
            <input
              type="text"
              name="email"
              className="register-popup__input"
              placeholder="Enter your email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="error-message">{formik.errors.email}</p>
            )}
          </div>

          {/* Node Address */}
          <div className="field">
            <label className="register-popup__label">
              Node Address<span className="astrick">*</span>
            </label>
            <input
              type="text"
              name="nodeAddress"
              className="register-popup__input"
              placeholder="Enter Node Address"
              value={formik.values.nodeAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.nodeAddress && formik.errors.nodeAddress && (
              <p className="error-message">{formik.errors.nodeAddress}</p>
            )}
          </div>

          {/* Choose Plan */}
          <div className="field">
            <label className="register-popup__label">
              Choose Plan<span className="astrick">*</span>
            </label>
            <select
              name="choosePlan"
              className="register-popup__select"
              value={formik.values.choosePlan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">-- Select a Plan --</option>
              {Array.isArray(planList) &&
                planList.map((plan) => (
                  <option key={plan.id} value={JSON.stringify(plan)}>
                    {plan.prices.length > 0
                      ? `${
                          plan.prices[0].quote_value
                        } ${plan.prices[0].denom.toUpperCase()}/month`
                      : `Plan ${plan.id}`}
                  </option>
                ))}
            </select>
            {formik.touched.choosePlan && formik.errors.choosePlan && (
              <p className="error-message">{formik.errors.choosePlan}</p>
            )}
          </div>

          {/* Choose Action */}
          <div className="field">
            <label className="register-popup__label">
              Choose Action<span className="astrick">*</span>
            </label>
            <select
              name="chooseAction"
              className="register-popup__select"
              value={formik.values.chooseAction}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">-- Select Action --</option>
              <option value="Link">Link</option>
              <option value="Unlink">Unlink</option>
            </select>
            {formik.touched.chooseAction && formik.errors.chooseAction && (
              <p className="error-message">{formik.errors.chooseAction}</p>
            )}
          </div>

          {/* Submit */}
          <div className="register-popup__actions">
            <ButtonCustom regularBtn label="Submit" type="submit" />
          </div>
        </form>
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
