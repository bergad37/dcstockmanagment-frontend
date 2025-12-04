interface ButtonProps {
  label: string;
  onClick?: () => void;
  bg?: string; // background color classes
  className?: string; // extra styles
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode; // optional icon
}

const Button = ({
  label,
  onClick,
  bg = "bg-[#073c56]", // default color
  className = "",
  fullWidth = false,
  disabled = false,
  children
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${bg}
        text-white font-semibold text-sm
        px-4 py-2 rounded-3xl shadow
        hover:opacity-90
        focus:outline-none focus:ring-0 active:outline-none active:ring-0
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
      {label}
    </button>
  );
};

export default Button;
