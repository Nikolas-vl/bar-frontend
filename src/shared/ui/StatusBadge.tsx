type StatusBadgeProps<T extends string> = {
  status: T;
  config: Record<T, { label: string; color: string }>;
};

export function StatusBadge<T extends string>({ status, config }: StatusBadgeProps<T>) {
  const item = config[status];

  if (!item) return null;

  return <span className={`badge badge-${item.color}`}>{item.label}</span>;
}
