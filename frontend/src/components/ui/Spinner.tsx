import React from 'react';
import { cn } from 'src/lib/cn';

export const Spinner: React.FC<SpinnerProps> = React.memo(
  ({ className, size, ...props }) => (
    <svg
      style={{ width: size, height: size }}
      className={cn('h-12 w-12', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      {...props}
    >
      <radialGradient
        id="a12"
        cx=".66"
        fx=".66"
        cy=".3125"
        fy=".3125"
        gradientTransform="scale(1.5)"
      >
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".3" stopColor="#FFFFFF" stopOpacity=".9" />
        <stop offset=".6" stopColor="#FFFFFF" stopOpacity=".6" />
        <stop offset=".8" stopColor="#FFFFFF" stopOpacity=".3" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <circle
        transform-origin="center"
        fill="none"
        stroke="url(#a12)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray="200 1000"
        strokeDashoffset="0"
        cx="100"
        cy="100"
        r="70"
      >
        <animateTransform
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="0.666"
          values="0;360"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        transform-origin="center"
        fill="none"
        opacity="0.2"
        stroke="#FFFFFF"
        strokeWidth="15"
        strokeLinecap="round"
        cx="100"
        cy="100"
        r="70"
      />
    </svg>
  ),
);

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}
