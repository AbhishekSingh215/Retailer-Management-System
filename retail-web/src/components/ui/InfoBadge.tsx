import React from 'react';

interface InfoBadgeProps {
  icon: React.ReactNode;
  value: string;
  onClick?: () => void;
  className?: string;
  /**
   * Variant for colour scheme – currently only "primary" (indigo) is used.
   */
  variant?: 'primary';
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({
  icon,
  value,
  onClick,
  className,
  variant = 'primary',
}) => {
  // Base styling – a compact, pill‑like chip that works in light & dark modes.
  const base =
    'flex items-center gap-2 px-2.5 py-0.5 rounded-md border border-indigo-300/30 backdrop-blur-sm';

  const variantClasses: Record<string, string> = {
    primary:
      'bg-indigo-600/80 text-white hover:bg-indigo-700/90 dark:bg-indigo-500/80 dark:hover:bg-indigo-600/90 shadow-md hover:shadow-lg transition-all duration-150',
  };

  const hover = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${base} ${variantClasses[variant]} ${hover} ${className ?? ''}`}
      onClick={onClick}
      aria-label={value}
    >
      {icon}
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};
