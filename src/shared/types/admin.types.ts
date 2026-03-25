import type { ComponentType, SVGProps } from 'react';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface AdminNavLink {
  to: string;
  label: string;
  icon: IconComponent;
  end?: boolean;
}
