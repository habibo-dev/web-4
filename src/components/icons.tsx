import type { SVGProps } from "react";

/**
 * Hand-drawn line-icon set (24×24 grid, stroke 1.7, round caps) — inherits
 * currentColor and works in RTL without flipping where symmetric.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const BedIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 18v-8m0 4h18m0 4v-6a2 2 0 0 0-2-2H9v8" />
    <path d="M6.5 14v-2.5h2.5V14" />
  </Svg>
);

export const BathIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2Z" />
    <path d="M6 12V5.5A1.5 1.5 0 0 1 7.5 4c.8 0 1.3.4 1.6 1M7 20l-1 1.5M17 20l1 1.5" />
  </Svg>
);

export const AreaIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 3h6m9 0h3m0 0v6m0 9v3m0 0h-6m-9 0H3m0 0v-6M3 9V3" />
    <path d="M13.5 13.5H17m-3.5 0V17" opacity={0.9} />
  </Svg>
);

export const BuildingIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 21V6.2c0-.6.4-1.1 1-1.3l7-2c.8-.2 1.5.4 1.5 1.2V21" />
    <path d="M13 10h6c.6 0 1 .4 1 1v10M2 21h20M7 8.5v.01M7 12v.01M7 15.5v.01M10 8.5v.01M10 12v.01M10 15.5v.01M16.5 13.5v.01M16.5 17v.01" />
  </Svg>
);

export const VillaIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3 11 9-7 9 7" />
    <path d="M5.5 9.5V20h13V9.5M3 20h18M10 20v-5h4v5" />
  </Svg>
);

export const TreeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21v-4" />
    <path d="M12 17 6 15l2-3-3-1 3.5-5L12 3l3.5 3L19 11l-3 1 2 3-6 2Z" />
  </Svg>
);

export const ShopIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.8 9H20.2L19 4.6a1 1 0 0 0-1-.6H6a1 1 0 0 0-1 .6L3.8 9Z" />
    <path d="M4.5 9v10a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9M9.5 20v-5.5h5V20" />
  </Svg>
);

export const DeskIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8.5h18M3 8.5 4.5 4h15L21 8.5M5.5 8.5V19m13-10.5V19M3 13.5h18" />
  </Svg>
);

export const KeyIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="4.5" />
    <path d="m11.4 11.4 8 8m-3-3 2-2m-5-1 2-2" />
  </Svg>
);

export const HandshakeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m2.5 12.5 4-4a2.1 2.1 0 0 1 3 0l1 1-3 3a1.6 1.6 0 0 0 2.3 2.3l1.7-1.7" />
    <path d="m21.5 12.5-4-4a2.1 2.1 0 0 0-3 0l-4 4 2.8 2.8a1.6 1.6 0 0 0 2.3-2.3l1.9 1.9a1.4 1.4 0 0 0 2-2l-1-1" />
    <path d="M2.5 8.5h3M18.5 8.5h3" />
  </Svg>
);

export const ScaleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v18M5 21h14M12 6l-6 1.5L3 13a3.5 3.5 0 0 0 6 0L6.5 8M12 6l6 1.5L21 13a3.5 3.5 0 0 1-6 0l2.5-6.5" />
  </Svg>
);

export const CompassIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </Svg>
);

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 3.5 9 4l1 4-2 1.6a12.5 12.5 0 0 0 6.4 6.4l1.6-2 4 1 .5 2.5a2 2 0 0 1-2.2 2.3C10.5 19.3 4.7 13.5 4.2 5.7A2 2 0 0 1 6.5 3.5Z" />
  </Svg>
);

export const WhatsAppIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96c0 1.76.46 3.48 1.34 5L2 22l5.2-1.38a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96c0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm0 1.8c2.18 0 4.23.85 5.77 2.4a8.12 8.12 0 0 1 2.4 5.78c0 4.5-3.67 8.16-8.18 8.16a8.16 8.16 0 0 1-4.15-1.14l-.3-.18-3.08.82.83-3-.2-.31a8.1 8.1 0 0 1-1.25-4.35c0-4.5 3.67-8.17 8.17-8.17Zm-3.6 4.15c-.17 0-.44.06-.67.31c-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.12.17 1.75 2.78 4.31 3.8c2.12.82 2.55.66 3.02.61c.46-.04 1.5-.6 1.71-1.19c.21-.58.21-1.08.15-1.19c-.06-.1-.23-.17-.48-.29c-.25-.13-1.5-.74-1.72-.82c-.23-.09-.39-.13-.56.12c-.16.25-.64.82-.79.99c-.14.17-.29.19-.54.06c-.25-.12-1.06-.39-2.02-1.25c-.75-.67-1.25-1.5-1.4-1.75c-.14-.25-.01-.4.11-.52c.11-.12.25-.3.38-.45c.12-.15.16-.25.25-.42c.08-.17.04-.31-.02-.44c-.06-.12-.56-1.37-.77-1.87c-.2-.5-.4-.42-.56-.43h-.54Z" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4m8-4v4" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 7v5.2l3.2 2" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m15.9 15.9 4.6 4.6" />
  </Svg>
);

export const SlidersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h9m3 0h4M4 17h4m3 0h9" />
    <circle cx="14.5" cy="7" r="1.9" />
    <circle cx="9.5" cy="17" r="1.9" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 12.5 4.7 4.7L19.5 6.7" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m14.5 5-7 7 7 7" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 9 7 7 7-7" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 5 14 14M19 5 5 19" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 7h17m-17 5h17m-17 5h11" />
  </Svg>
);

export const ExpandIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4H4v5m11-5h5v5M9 20H4v-5m11 5h5v-5" />
  </Svg>
);

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 4H20v6.5M20 4l-8.5 8.5M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5" />
  </Svg>
);

export const LinkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.8 14.2a3.8 3.8 0 0 1 0-5.4l3-3a3.8 3.8 0 0 1 5.4 5.4l-1.3 1.3" />
    <path d="M14.2 9.8a3.8 3.8 0 0 1 0 5.4l-3 3a3.8 3.8 0 0 1-5.4-5.4l1.3-1.3" />
  </Svg>
);

export const UploadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V15" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20.3 4.9 13.2a4.6 4.6 0 0 1 6.5-6.5l.6.6.6-.6a4.6 4.6 0 0 1 6.5 6.5L12 20.3Z" />
  </Svg>
);

export const SparkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6.2 6.2l2.8 2.8m6 6 2.8 2.8m0-11.6-2.8 2.8m-6 6-2.8 2.8" />
  </Svg>
);

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 5.7V11c0 4.6 3 8.1 7 10 4-1.9 7-5.4 7-10V5.7L12 3Z" />
    <path d="m9 11.5 2.2 2.2L15.2 9.7" />
  </Svg>
);

export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4v-11Z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Svg>
);

export const CarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 15.5h14M4.5 15.5v2m15-2v2M4 12.5l1.4-4A1.6 1.6 0 0 1 7 7.3h10a1.6 1.6 0 0 1 1.6 1.2l1.4 4v2.5a.5.5 0 0 1-.5.5h-.5M4 12.5v2.5a.5.5 0 0 0 .5.5H5m-.5-3h15" />
    <path d="M7.5 10.3v.01M16.5 10.3v.01" />
  </Svg>
);

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3 11 9-7.5L21 11" />
    <path d="M5.5 9.2V20h13V9.2M9.5 20v-5.5h5V20" />
  </Svg>
);

export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6m9.6 9.6 1.6 1.6m0-12.8-1.6 1.6M7.2 16.8l-1.6 1.6" />
  </Svg>
);

export const WavesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8.5c1.8 0 1.8 1.5 3.6 1.5S8.4 8.5 10.2 8.5s1.8 1.5 3.6 1.5 1.8-1.5 3.6-1.5S19.2 10 21 10M3 13.5c1.8 0 1.8 1.5 3.6 1.5s1.8-1.5 3.6-1.5 1.8 1.5 3.6 1.5 1.8-1.5 3.6-1.5 1.8 1.5 3.6 1.5" />
  </Svg>
);
