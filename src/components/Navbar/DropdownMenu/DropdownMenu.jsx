import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import EnterIcon from "../../../assets/images/icons/enter.png";
import ExitIcon from "../../../assets/images/icons/exit.png";

const DropdownMenu = ({
  closeMenu,
  openWaxModal,
  onHandleLogout,
  menuList,
}) => {
  const { waxConnected, anchorConnected } = useSelector((store) => store.user);
  const dropdownRef = useRef(null);
  const dropdownTransition = {
    type: "spring",
    ease: "easeInOut",
    damping: 30,
  };

  useEffect(() => {
    return () => closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.parentElement.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <motion.div
      transition={dropdownTransition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.dropdownMenu}
      ref={dropdownRef}
    >
      {menuList.map(
        (item, index) =>
          item.isShow && (
            <React.Fragment key={index}>
              <Link key={index} to={item.link} onClick={closeMenu}>
                {item.title}
              </Link>
              <div className={styles.dropdownMenu_line}></div>
            </React.Fragment>
          )
      )}

      {!waxConnected && !anchorConnected ? (
        <div className={styles.dropdownMenu_walletInfo} onClick={openWaxModal}>
          <img
            rel="preload"
            src={EnterIcon}
            alt="Connect logo"
            width="25"
            height="25"
          />
          <span className={styles.dropdownMenu_walletInfo_btnItem}>
            Connect Wallet
          </span>
        </div>
      ) : (
        <div
          className={styles.dropdownMenu_walletInfo}
          onClick={onHandleLogout}
        >
          <span className={styles.dropdownMenu_walletInfo_btnItem}>
            Disconnect Wallet
          </span>
          <img
            rel="preload"
            src={ExitIcon}
            alt="Disconnect logo"
            width="25"
            height="25"
          />
        </div>
      )}
    </motion.div>
  );
};

export default DropdownMenu;
