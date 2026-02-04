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
        "h-20 w-20 sm:h-24 sm:w-24",
        "rounded-full text-center",
        "bg-gradient-to-b from-red-600 via-red-700 to-red-900",
        "text-white font-serif text-xs sm:text-sm tracking-wide",
        "shadow-[0_6px_0_#7f1d1d,0_10px_25px_rgba(0,0,0,0.35)]",
        "transition-transform duration-150 active:translate-y-1",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),rgba(255,255,255,0)_40%)]",
        "after:absolute after:inset-2 after:rounded-full",
        "after:border after:border-red-300/50 after:opacity-60",
        className,
      ].join(" ")}
      aria-label="Send The Magic Now ($39.99)"
    >
      <span className="px-2 leading-tight">
        Send The
        <br />
        Magic Now
        <br />
        ($39.99)
      </span>
    </button>
  );
};

export default CtaWaxSealButton;
