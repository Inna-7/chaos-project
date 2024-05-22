import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { User } from "../../../UserService";
import Button from "../../Button/Button";
import Input from "../../Input/Input";
import closeIcon from "../../../assets/images/icons/icons8-close-48.png";

const WithdrawAmountModal = ({ player, onClose }) => {
  const modalRef = useRef(null);
  const { waxConnected, anchorConnected } = useSelector((store) => store.user);
  const [value, setValue] = useState("");
  const [buttonLoader, setButtonLoader] = useState(null);

  const modalTransition = {
    type: "spring",
    ease: "easeInOut",
    damping: 30,
  };

  // withdraw
  const withdrawWithAnchor = (player, value) => {
    if (buttonLoader) return;

    setButtonLoader(player.player);
    User.anchorSession
      ?.transact(
        {
          actions: [
            {
              account: "xcryptochaos",
              name: "withdraw",
              authorization: [
                {
                  actor: User.anchorSession?.auth?.actor.toString(),
                  permission: "active",
                },
              ],
              data: {
                player: User.anchorSession?.auth?.actor.toString(),
                amount: value,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )
      .then((_) => {
        toast.success("Withdraw completed");
        setButtonLoader(null);
      })
      .catch((error) => {
        toast.error("Value is more than balance or doesn't exist");
        setButtonLoader(null);
      });
  };

  const withdrawWithWaxCloud = (player, value) => {
    if (buttonLoader) return;

    setButtonLoader(player.player);
    User.wax.api
      .transact(
        {
          actions: [
            {
              account: "xcryptochaos",
              name: "withdraw",
              authorization: [
                {
                  actor: User.wax?.userAccount,
                  permission: "active",
                },
              ],
              data: {
                player: User.wax?.userAccount,
                amount: value,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      )
      .then((_) => {
        toast.success("Withdraw completed");
        setButtonLoader(null);
      })
      .catch((error) => {
        toast.error("Value is more than balance or doesn't exist");
        setButtonLoader(null);
      });
  };

  const withdraw = () => {
    if (anchorConnected) {
      withdrawWithAnchor(player, value);
    } else if (waxConnected) {
      withdrawWithWaxCloud(player, value);
    }
  };

  return (
    <motion.div
      transition={modalTransition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={modalRef}
      className={styles.container}
      onClick={onClose}
    >
      <div
        className={styles.container_modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.container_modal_modalHeader}>
          <h3>Write an amount</h3>
          <img
            rel="preload"
            className={styles.container_modal_modalHeader_close}
            src={closeIcon}
            onClick={onClose}
            alt="close icon"
          />
        </div>

        <div className={styles.container_modal_modalBody}>
          <Input
            type="number"
            label="Amount"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className={styles.container_modal_modalFooter}>
          <Button onClick={onClose} size="fit" color="blue">
            Close
          </Button>
          <Button onClick={() => withdraw()} size="fit" color="blue">
            Withdraw
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WithdrawAmountModal;
