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
        "transition-transform duration-150 ease-in-out",
        "hover:scale-[1.02]",
        "active:scale-[0.98]",
        className,
      ].join(" ")}
      aria-label="Send The Magic Now ($39.99)"
    >
      <img
        src="/cta-button-lotr.png"
        alt="Send The Magic Now - $39.99"
        className="h-auto w-full max-w-md drop-shadow-lg"
      />
    </button>
  );
};

export default CtaWaxSealButton;