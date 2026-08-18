interface IconProps {
  size?: number
}

function Svg({ size = 20, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const IconBolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
  </Svg>
)

export const IconBoltOff = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
    <path d="M3 3l18 18" />
  </Svg>
)

export const IconGrid = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </Svg>
)

export const IconTimer = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2M9 2h6" />
  </Svg>
)

export const IconFlip = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 8a8 8 0 0 0-13.5-3L4 7" />
    <path d="M4 4v3.5h3.5" />
    <path d="M4 16a8 8 0 0 0 13.5 3L20 17" />
    <path d="M20 20v-3.5h-3.5" />
  </Svg>
)

export const IconImage = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" />
  </Svg>
)

export const IconMirror = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v18" />
    <path d="M9 7 4 12l5 5V7Z" />
    <path d="M15 7l5 5-5 5V7Z" />
  </Svg>
)

export const IconRotate = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 4h3a2 2 0 0 1 2 2v3" />
    <path d="M18 2.5 20.5 5 18 7.5" />
    <rect x="3" y="9" width="12" height="12" rx="2" />
  </Svg>
)

export const IconCompare = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M12 4v16" />
    <path d="M7 10h.01M7 14h.01" />
  </Svg>
)

export const IconClose = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const IconReset = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6" />
    <path d="M4 4v5h5" />
  </Svg>
)
