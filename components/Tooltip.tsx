import Image from 'next/image';
import React, { useState } from 'react';

type TooltipProps = {
  content: string
};

const Tooltip = ({ content }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="relative cursor-pointer"
    >
      {visible && (
        <div
          className="absolute z-10 p-2 bg-gray-700 text-white rounded w-60"
          style={{ top: '1.5rem', left: '50%', transform: 'translateX(-50%)' }}
        >
          {content}
        </div>
      )}
        <div className="relative w-3 h-3">
          <Image
            src="/icons/tooltip.svg"
            alt="tooltip"
            fill={true}
            sizes="(min-width: 1rem) 24vw"
            loading="lazy"
          />
        </div>
    </div>
  )
};

export default Tooltip;
