import React, { useEffect } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";

import { useToast, ToastProps } from "../../../hooks/toast";

import { Container } from "./styles";

interface ToastPropsData {
  toast: ToastProps;
  // eslint-disable-next-line @typescript-eslint/ban-types
  style: object;
}

const icons = {
  success: <FiCheckCircle size={20} />,
  error: <FiAlertCircle size={20} />,
  info: <FiInfo size={20} />,
};

const Toast: React.FC<ToastPropsData> = ({ toast, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(
      () => {
        removeToast(toast.id);
      },
      3000,
      []
    );

    return () => clearTimeout(timer);
  }, [removeToast, toast.id]);

  return (
    <Container
      type={toast.type}
      hasDescription={Number(!!toast.description)} // pra dom não reclamar
      style={style}
    >
      {icons[toast.type || "info"]}

      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(toast.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
