import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/LogoDvpn.svg";
import mobLogo from "../assets/MobileLogo.svg";
import ButtonCustom from "../Common/ButtonCustom/ButtonCustom";
import CopyText from "../Common/Copy/copyText";
import { apiUrls } from "../Constant/apiUrls";
import { apiMethods, navTabs } from "../Constant/constants";
import { env } from "../Constant/envConstants";
import { useIsLoggedIn } from "../Context/LoggedInContext";
import useGetApi from "../Hooks/useGetApi";
import "../styles/components/header/header.scss";
import { api, toFirstCapital } from "../utils/Helper/CommonHelper";
import { LogoutConfirmModal } from "./register/LogoutModal";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authData, setAuthData, status, setStatus, setRequest } =
    useIsLoggedIn();
  const [balance, setBalance] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // menu state
  const hasHeaderActions = true; // define this, or make it conditional based on route
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // const handleResize = () => {
  //   setIsMobile(window.innerWidth <= 768);
  // };
  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const getStatus = async (address) => {
    try {
      const { success, data } = await useGetApi(
        apiUrls.getStatus(address),
        apiMethods.GET
      );
      if (!success) {
        console.error("No node address in the request");
        return;
      }
      setRequest(data?.data?.requestFor);
      setStatus(data?.data?.status);
    } catch (error) {
      toast.error(error?.message);
    }
  };
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-badge active";
      case "inactive":
        return "status-badge inactive";
      case "pending":
        return "status-badge pending";
      case "approved":
        return "status-badge approved";
      case "rejected":
        return "status-badge rejected";
      default:
        return "status-badge default";
    }
  };
  const FetchAccountBalance = async (address) => {
    try {
      const uri = `${env.swagger_api}/cosmos/bank/v1beta1/balances/${address}`;
      const response = await api(uri);
      if (response?.balances?.[0]?.amount) {
        setBalance(response.balances[0].amount / 1e18);
      } else {
        setBalance(0);
      }
    } catch (e) {
      toast.error("Error in fetching the balance");
    }
  };
  const handleClick = async () => {
    if (!window.keplr) {
      if (/Android/i.test(navigator.userAgent)) {
        // Android
        window.location.href =
          "intent://wc#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;";
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // iOS
        window.location.href = "keplrwallet://";
      } else {
        toast.error("Install Keplr extension first");
      }
      return;
    }
    const chainId = env.chainId;

    try {
      // await window.keplr.disable(chainId);
      await window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      if (!accounts.length) {
        toast.error("No accounts found in Keplr");
        return;
      }

      // const evmAddress = await showEVMAddress(accounts[0].address);
      // console.log("🚀 ~ connectWallet ~ evmAddress:", evmAddress)
      // const valoperAddress = await convertToValoperAddress(
      //   accounts[0].address
      // );

      setAuthData(accounts[0]?.address);
      toast.success("Wallet connected successfully!");
      getStatus(accounts[0]?.address);
      FetchAccountBalance(accounts[0]?.address);
    } catch (error) {
      console.error("Keplr login error:", error);
      toast.error("Failed to connect Keplr: " + error.message);
    }
  };
  const handleLogout = () => {
    setAuthData("");
    setStatus("");
    toast.success("Wallet disconnected");
    setShowLogoutModal(false);
    navigate("/");
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const isActive = useCallback(
    (path) => {
      return location.pathname === path ? "active" : "";
    },
    [location.pathname]
  );

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div
            className="header__logo"
            onClick={() => {
              navigate("/");
            }}
          >
            <img
              src={isMobile ? mobLogo : Logo}
              alt="Logo"
              className={isMobile ? "mobile-logo" : "web-logo"}
            />
          </div>

          <div className={`header__action ${isMenuOpen ? "active" : ""}`}>
            {location.pathname !== "/" ? (
              !authData ? (
                <ButtonCustom
                  regularBtn
                  label="Connect Keplr Wallet"
                  onClick={handleClick}
                />
              ) : (
                <div
                  className={`header__nav ${isMenuOpen ? "active" : ""}`}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div className="nav_left">
                    {navTabs.map((tab) => (
                      <Link
                        key={tab.path}
                        to={tab.path}
                        className={`nav_tabs ${isActive(tab.path)}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {tab.label}
                      </Link>
                    ))}
                  </div>
                  <div className="nav_actions">
                    <span className="gradientbrder">
                      {Number(balance || 0).toFixed(2)} TICS
                    </span>
                    {authData && status && (
                      <ButtonCustom
                        className={getStatusClass(status) + " cursorIntial"}
                        regularBtn
                        label={toFirstCapital(status)}
                      />
                    )}
                    <div
                      className="gradientbrder"
                      onClick={() => {
                        navigator.clipboard.writeText(authData);
                        setCopied(true);
                        setTimeout(() => {
                          setCopied(false);
                        }, 1000);
                      }}
                    >
                      <div className="text-add">
                        {authData.slice(0, 4)}...{authData.slice(-4)}
                      </div>
                      <CopyText text={authData} copy={copied} />
                    </div>
                    <ButtonCustom
                      regularBtn
                      label="Logout"
                      onClick={() => setShowLogoutModal(true)}
                    />
                  </div>
                </div>
              )
            ) : null}
          </div>
          {hasHeaderActions && location.pathname != "/" && (
            <button
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </header>
      <LogoutConfirmModal
        show={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Header;
