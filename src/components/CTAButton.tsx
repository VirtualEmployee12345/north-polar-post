import React from "react";

type CtaWaxSealButtonProps = {
  onClick?: () => void;
  className?: string;
};

const CtaWaxSealButton: React.FC<CtaWaxSealButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative inline-flex items-center justify-center",
        "h-28 w-28 sm:h-32 sm:w-32",
        "rounded-full text-center",
        "bg-gradient-to-br from-red-500 to-red-800",
        "text-white font-serif text-sm sm:text-base tracking-wide",
        "shadow-[0_8px_0_#7f1d1d,0_12px_30px_rgba(0,0,0,0.4)]",
        "transition-all duration-150 ease-in-out",
        "hover:shadow-[0_6px_0_#7f1d1d,0_10px_25px_rgba(0,0,0,0.35)] hover:-translate-y-0.5",
        "active:shadow-[0_2px_0_#7f1d1d,0_4px_10px_rgba(0,0,0,0.3)] active:translate-y-1",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),rgba(255,255,255,0)_50%)]",
        "after:absolute after:inset-2 after:rounded-full",
        "after:border-2 after:border-red-400/60 after:opacity-70",
        className,
      ].join(" ")}
      aria-label="Send The Magic Now ($39.99)"
    >
      <span className="px-2 leading-tight">
        Send The
        <br />
        Magic Now
        <br />
        <span className="font-bold text-lg">$39.99</span>
      </span>
    </button>
  );
};

export default CtaWaxSealButton;
