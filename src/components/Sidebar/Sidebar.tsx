"use client";

import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDisclosure } from "@nextui-org/modal";
import { selectAuthState } from "@/store/authSlice";

import styles from "./Sidebar.module.css";

import History from "../History/History";
import Library from "../Library/Library";
import Plugins from "../Plugins/Plugins";
import Profile from "../Profile/Profile";
import Settings from "../Settings/Settings";
import Auth from "../Auth/Auth";

import Logo from "../../../public/Logo.svg";
import Menu from "../../../public/svgs/Menu.svg";
import Pen from "../../../public/svgs/Pen.svg";
import Chat from "../../../public/svgs/sidebar/Chat_Active.svg";
import ChatInactive from "../../../public/svgs/sidebar/Chat_Inactive.svg";
import Folder from "../../../public/svgs/sidebar/Folder_Active.svg";
import FolderInactive from "../../../public/svgs/sidebar/Folder_Inactive.svg";
import Setting from "../../../public/svgs/sidebar/Setting_Active.svg";
import SettingInactive from "../../../public/svgs/sidebar/Setting_Inactive.svg";
import Plugin from "../../../public/svgs/sidebar/Plugin_Active.svg";
import PluginInactive from "../../../public/svgs/sidebar/Plugin_Inactive.svg";
import User from "../../../public/svgs/sidebar/User.svg";
import Collapse from "../../../public/svgs/sidebar/Collapse.svg";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const Sidebar = () => {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState("history");

  const [width, setWidth] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Track window width
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };
    if (width <= 512) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, width]);

  // Reset selection on logout
  useEffect(() => {
    if (!authState) {
      setSelected("history");
    }
  }, [authState]);

  const closeSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      closeSidebar();
    } else {
      setIsSidebarOpen(true);
      setIsClosing(false);
    }
  };

  const handleProfileClick = () => {
    if (authState) {
      setSelected("profile");
    } else {
      closeSidebar();
      onOpen();
    }
  };

  const handleNewChat = () => {
    router.push("/");
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const res = await fetch("/api/checkout", { method: "POST" });
    const session = await res.json();

    if (session?.id) {
      await stripe?.redirectToCheckout({ sessionId: session.id });
    } else {
      console.error("Stripe session not created", session);
    }
  };

  return (
    <>
      {/* Sidebar Header */}
      <div className={styles.header}>
        <div onClick={toggleSidebar} className={styles.menu}>
          <Image priority src={Menu} alt="Menu" width={24} height={24} />
        </div>
        <div
          className={styles.titleButton}
          style={{ opacity: isSidebarOpen ? 0 : 1 }}
          onClick={handleNewChat}
        >
          <Image
            priority
            src={Pen}
            alt={"Pen"}
            width={20}
            height={20}
            className={styles.titleButtonIcon}
          />
          <p className={styles.titleButtonText}>New Chat</p>
        </div>
      </div>

      {/* Sidebar Body */}
      {isSidebarOpen && (
        <>
          <div
            ref={sidebarRef}
            className={`${styles.container} ${
              isSidebarOpen && !isClosing ? styles.opening : ""
            } ${isClosing ? styles.closing : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className={styles.barContainer}>
              <Image src={Logo} alt="Logo" className={styles.logo} />
              <div className={styles.iconContainer}>
                <div>
                  {selected === "history" ? (
                    <Image src={Chat} alt="History" className={styles.iconActive} />
                  ) : (
                    <Image
                      src={ChatInactive}
                      alt="History"
                      className={styles.icon}
                      onClick={() => setSelected("history")}
                    />
                  )}
                  {selected === "library" ? (
                    <Image src={Folder} alt="Library" className={styles.iconActive} />
                  ) : (
                    <Image
                      src={FolderInactive}
                      alt="Library"
                      className={styles.icon}
                      onClick={() => setSelected("library")}
                    />
                  )}
                  {selected === "settings" ? (
                    <Image src={Setting} alt="Settings" className={styles.iconActive} />
                  ) : (
                    <Image
                      src={SettingInactive}
                      alt="Settings"
                      className={styles.icon}
                      onClick={() => setSelected("settings")}
                    />
                  )}
                  {selected === "plugins" ? (
                    <Image src={Plugin} alt="Plugins" className={styles.iconActive} />
                  ) : (
                    <Image
                      src={PluginInactive}
                      alt="Plugins"
                      className={styles.icon}
                      onClick={() => setSelected("plugins")}
                    />
                  )}
                </div>
                <div>
                  <Image
                    src={Collapse}
                    alt="Collapse"
                    className={styles.icon}
                    onClick={closeSidebar}
                  />
                  <Image
                    src={User}
                    alt="Profile"
                    className={selected === "profile" ? styles.iconActive : styles.icon}
                    style={{ marginBottom: 0 }}
                    onClick={handleProfileClick}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Main Content */}
            <div
              className={styles.mainContainer}
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {selected === "history" ? (
                <History />
              ) : selected === "library" ? (
                <Library />
              ) : selected === "settings" ? (
                <Settings />
              ) : selected === "plugins" ? (
                <Plugins />
              ) : (
                <Profile close={closeSidebar} />
              )}
            </div>

            {/* Footer with Buy Button */}
            <div style={{ padding: "16px", borderTop: "1px solid #333" }}>
              <button
                style={{
                  padding: "10px",
                  background: "#635bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: 500,
                }}
                onClick={handleCheckout}
              >
                Buy Pro Plan – $10
              </button>
            </div>
          </div>

          {/* Mobile Overlay */}
          {width <= 512 && (
            <div
              className={`${styles.mobileOverlay} ${
                isClosing ? styles.mobileOverlayClosing : ""
              }`}
            />
          )}
        </>
      )}

      {/* Auth Modal */}
      <Auth isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Sidebar;
