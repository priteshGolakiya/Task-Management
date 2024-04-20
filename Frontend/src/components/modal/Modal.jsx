/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  const handleKeydown = (ev) => {
    if (ev.key === "Escape") {
      onClose(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && !modalRef.current.contains(event.target)) {
        onClose(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isOpen, onClose]);

  const modalRef = React.useRef();

  return isOpen ? (
    <div className={`${styles["modal-comp"]} show`} onKeyDown={handleKeydown}>
      <div className={styles.dialog} ref={modalRef} tabIndex={1}>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
