import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

interface NavItemProps {
  to: string;
  children: ReactNode;
  end?: boolean;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
}

export function NavItem({ to, children, end, onClick, className, activeClassName }: NavItemProps) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={({ isActive }) => cn(className, isActive && activeClassName)}>
      {children}
    </NavLink>
  );
}
