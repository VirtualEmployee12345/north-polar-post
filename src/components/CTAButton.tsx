"use client";

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
      className={`wax-seal-button ${className}`}
      aria-label="Send The Magic Now - $39.99"
    >
      Send The Magic Now - $39.99
    </button>
  );
};

export default CtaWaxSealButton;
