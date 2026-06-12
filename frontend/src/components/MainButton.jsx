import { motion } from "framer-motion";

const MainButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-[10px] text-sm md:text-md font-semibold text-nowrap disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer ${className}`}
      style={{
        background: "var(--color-accent)",
        color: "#ffffff",
        boxShadow: "0 4px 16px rgba(99,102,241,.35)",
      }}
    >
      {children}
    </motion.button>
  );
};

export default MainButton;
