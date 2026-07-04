import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const Logo = ({ size = 32, className = '', ...props }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      {...props}
    >
      {/* Outer Hexagon Container */}
      <path
        d="M16 3L29 10.5V25.5L16 33L3 25.5V10.5L16 3Z"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="stroke-blue-600"
      />
      {/* Inner Interlocking Nexus Shape */}
      <path
        d="M11 12.5L16 15.5L21 12.5V23.5L16 20.5L11 23.5V12.5Z"
        fill="#10B981"
        className="fill-emerald-500"
      />
    </svg>
  );
};

export default Logo;
