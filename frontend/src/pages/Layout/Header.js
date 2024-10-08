import React, { useState, useEffect } from "react";
import GradientButton from "../../uiTools/Button/GradientButtonHeader";
import WalletWhiteSmall from "../SVGIcons/WalletWhiteSmall";
import { useLocation, useNavigate } from "react-router-dom";
import LogoImage from "../../assets/logo.png";
import Wallet from "../../pages/SVGIcons/Wallet";
import Hamburger from "../../pages/SVGIcons/Hamburger";
import Cross from "../../assets/cross.svg";
import { isConnected } from "../../services/BackendConnectors/userConnectors/commonConnectors";
import Dark from "../../pages/SVGIcons/Dark";
import Light from "../../pages/SVGIcons/Light";
import ErrorModal from "../../uiTools/Modal/ErrorModal";

const Header = ({ linkStatus, darkMode, setDarkMode, setMetaStatus }) => {
    const [status, setStatus] = useState(false);

    const [errormsg, setErrormsg] = useState({
        status: false,
        msg: "",
    });

    const location = useLocation();
    const navigate = useNavigate();

    const fetchStatus = async () => {
        console.log("Fetching wallet status...");

        try {
            const getStatus = await isConnected();
            
            if (getStatus.success) {
                console.log("Wallet connected successfully");
                setStatus(true);
                localStorage.setItem("Wallet-Check", true);
                setMetaStatus(true);
            } else {
                if (localStorage.getItem("Wallet-Check") === "true") {
                    console.log("Wallet previously connected");
                    setStatus(true);
                    setMetaStatus(true);
                } else {
                    console.log("Wallet connection failed:", getStatus.msg);
                    setErrormsg({ status: !getStatus.success, msg: getStatus.msg });
                    setStatus(false);
                    setMetaStatus(false);
                }
            }
        } catch (error) {
            console.error("Error fetching wallet status:", error);
            // Handle error if needed
        }
    };

    const connectToMetaMask = async () => {
        if (window.ethereum) {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log("Connected account:", accounts[0]);
                setStatus(true);
                localStorage.setItem("Wallet-Check", true);
                setMetaStatus(true);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                setErrormsg({ status: true, msg: "Failed to connect to MetaMask" });
            }
        } else {
            console.error("MetaMask is not installed");
            setErrormsg({ status: true, msg: "MetaMask is not installed" });
        }
    };

    const hitRequestAccount = () => {
        console.log("Connecting wallet...");
        connectToMetaMask();
    };

    useEffect(() => {
        async function fetchData() {
            darkModeStatus();
            await connectToMetaMask();
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const darkModeStatus = () => {
        if (localStorage.getItem("dark-mode") === "false") {
            setDarkMode(false);
        } else {
            setDarkMode(true);
        }
    };

    const changeTheme = () => {
        setDarkMode((prev) => {
            console.log(prev);
            localStorage.setItem("dark-mode", !prev);
            return !prev;
        });
    };

    return (
        <>
            <div className="flex gap-4 sm:gap-8 px-2 sm:px-4 md:px-6 py-2 relative items-center bg-transparent text-neutral-700 dark:text-white">
                <div className="">
                    <img
                        className="md:w-40 h-11 w-28 md:h-16 cursor-pointer"
                        src={LogoImage}
                        alt="company logo"
                        onClick={() => navigate("/")}
                    />
                </div>
                
                <label className="ml-auto p-3 themetoggle-box rounded-full" htmlFor="themeToggle">
                    <input
                        type="checkbox"
                        id="themeToggle"
                        checked={darkMode}
                        onChange={changeTheme}
                        className="hidden"
                    />
                    <label htmlFor="themeToggle" className="themetoggle">
                        {darkMode ? <Light /> : <Dark />}
                    </label>
                </label>

                <ErrorModal errormsg={errormsg} setErrormsg={setErrormsg} />
                {!status ? (
                    <div className="">
                        <GradientButton onClick={hitRequestAccount}>
                            <Wallet fill={darkMode ? "white" : "#0D0F11"} /> Connect Wallet
                        </GradientButton>
                    </div>
                ) : (
                    <div className="outline outline-[#9281FF] rounded-full px-4 sm:px-6 md:px-8 flex items-center gap-2 py-2 sm:py-3">
                        <WalletWhiteSmall fill={darkMode ? "white" : "#0D0F11"} />
                        <div className="font-semibold text-sm sm:text-base md:text-lg">
                            Connected
                        </div>
                    </div>
                )}
                <div className="lg:hidden">
                    {location.pathname !== "/" ? (
                        <label htmlFor="dashboard-sidebar">
                            {!linkStatus ? (
                                <Hamburger />
                            ) : (
                                <img className="w-6" alt="Hamburger" src={Cross} />
                            )}
                        </label>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;