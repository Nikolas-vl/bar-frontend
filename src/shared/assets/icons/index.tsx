// ═══════════════════════════════════════════════
//  JOLIE BRASSERIE CAFÉ — Icon Library
//  All icons are inline SVG React components.
//  Usage: <IconMenu className="w-5 h-5" />
// ═══════════════════════════════════════════════

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// ── Navigation ───────────────────────────────────────────

export function IconHome(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z' />
      <path d='M9 21V12h6v9' />
    </svg>
  );
}

export function IconMenu(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <line x1='3' y1='6' x2='21' y2='6' />
      <line x1='3' y1='12' x2='21' y2='12' />
      <line x1='3' y1='18' x2='21' y2='18' />
    </svg>
  );
}

export function IconClose(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  );
}

// ── Food & Restaurant ────────────────────────────────────

export function IconDishes(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 3v2M12 19v2M3 12h2M19 12h2' />
      <circle cx='12' cy='12' r='4' />
    </svg>
  );
}

export function IconCoffee(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M18 8h1a4 4 0 0 1 0 8h-1' />
      <path d='M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z' />
      <line x1='6' y1='1' x2='6' y2='4' />
      <line x1='10' y1='1' x2='10' y2='4' />
      <line x1='14' y1='1' x2='14' y2='4' />
    </svg>
  );
}

export function IconUtensils(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' />
      <line x1='7' y1='2' x2='7' y2='22' />
      <path d='M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7' />
    </svg>
  );
}

// ── Orders & Cart ────────────────────────────────────────

export function IconCart(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <circle cx='9' cy='21' r='1' />
      <circle cx='20' cy='21' r='1' />
      <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
    </svg>
  );
}

export function IconOrders(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' />
      <rect x='9' y='3' width='6' height='4' rx='1' />
      <line x1='9' y1='12' x2='15' y2='12' />
      <line x1='9' y1='16' x2='13' y2='16' />
    </svg>
  );
}

export function IconPackage(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <line x1='16.5' y1='9.4' x2='7.5' y2='4.21' />
      <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
      <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
      <line x1='12' y1='22.08' x2='12' y2='12' />
    </svg>
  );
}

// ── Reservations & Tables ────────────────────────────────

export function IconReservation(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <rect x='3' y='4' width='18' height='18' rx='2' />
      <line x1='16' y1='2' x2='16' y2='6' />
      <line x1='8' y1='2' x2='8' y2='6' />
      <line x1='3' y1='10' x2='21' y2='10' />
      <path d='M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01' />
    </svg>
  );
}

export function IconTable(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <rect x='2' y='7' width='20' height='4' rx='1' />
      <line x1='6' y1='11' x2='6' y2='21' />
      <line x1='18' y1='11' x2='18' y2='21' />
      <line x1='4' y1='21' x2='8' y2='21' />
      <line x1='16' y1='21' x2='20' y2='21' />
    </svg>
  );
}

// ── Users & Auth ─────────────────────────────────────────

export function IconUser(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </svg>
  );
}

export function IconUsers(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
}

export function IconLogout(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
      <polyline points='16 17 21 12 16 7' />
      <line x1='21' y1='12' x2='9' y2='12' />
    </svg>
  );
}

export function IconLogin(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' />
      <polyline points='10 17 15 12 10 7' />
      <line x1='15' y1='12' x2='3' y2='12' />
    </svg>
  );
}

export function IconLock(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <rect x='3' y='11' width='18' height='11' rx='2' />
      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
    </svg>
  );
}

export function IconMail(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
      <polyline points='22,6 12,13 2,6' />
    </svg>
  );
}

// ── Admin ────────────────────────────────────────────────

export function IconDashboard(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <rect x='3' y='3' width='7' height='7' rx='1' />
      <rect x='14' y='3' width='7' height='7' rx='1' />
      <rect x='14' y='14' width='7' height='7' rx='1' />
      <rect x='3' y='14' width='7' height='7' rx='1' />
    </svg>
  );
}

export function IconSettings(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' />
    </svg>
  );
}

export function IconLocation(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z' />
      <circle cx='12' cy='10' r='3' />
    </svg>
  );
}

// ── UI ───────────────────────────────────────────────────

export function IconSearch(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <circle cx='11' cy='11' r='8' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
  );
}

export function IconFilter(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <polyline points='20 6 9 17 4 12' />
    </svg>
  );
}

export function IconChevronDown(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <polyline points='6 9 12 15 18 9' />
    </svg>
  );
}

export function IconChevronRight(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <polyline points='9 18 15 12 9 6' />
    </svg>
  );
}

export function IconChevronLeft(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <polyline points='15 18 9 12 15 6' />
    </svg>
  );
}

export function IconArrowRight(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <line x1='5' y1='12' x2='19' y2='12' />
      <polyline points='12 5 19 12 12 19' />
    </svg>
  );
}

export function IconStar(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  );
}

export function IconPhone(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l.82-.82a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
    </svg>
  );
}

export function IconClock(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <circle cx='12' cy='12' r='10' />
      <polyline points='12 6 12 12 16 14' />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <line x1='12' y1='5' x2='12' y2='19' />
      <line x1='5' y1='12' x2='19' y2='12' />
    </svg>
  );
}

export function IconMinus(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <line x1='5' y1='12' x2='19' y2='12' />
    </svg>
  );
}

export function IconTrash(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <polyline points='3 6 5 6 21 6' />
      <path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' />
      <path d='M10 11v6M14 11v6' />
      <path d='M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' />
    </svg>
  );
}

export function IconEdit(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
    </svg>
  );
}

export function IconEye(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );
}

export function IconEyeOff(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94' />
      <path d='M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19' />
      <line x1='1' y1='1' x2='23' y2='23' />
    </svg>
  );
}

export function IconAlert(p: IconProps) {
  return (
    <svg {...defaults} {...p}>
      <circle cx='12' cy='12' r='10' />
      <line x1='12' y1='8' x2='12' y2='12' />
      <line x1='12' y1='16' x2='12.01' y2='16' />
    </svg>
  );
}

export function IconSpinner(p: IconProps) {
  return (
    <svg {...defaults} strokeWidth={2} {...p} style={{ animation: 'spin 0.9s linear infinite', ...p.style }}>
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  );
}
