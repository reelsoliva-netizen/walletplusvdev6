import React from 'react';
import { useSecurity } from '../contexts/SecurityContext';
import { useSettings } from '../contexts/SettingsContext';

interface ProtectedBalanceProps {
  amount: number;
  className?: string;
  isInline?: boolean;
  prefix?: string;
}

const ProtectedBalance: React.FC<ProtectedBalanceProps> = ({ amount, className, isInline = false, prefix = '' }) => {
  const { isHidden } = useSecurity();
  const { formatCurrency } = useSettings();

  const content = isHidden ? '••••••' : `${prefix}${formatCurrency(amount)}`;
  const Tag = isInline ? 'span' : 'p';

  return (
    <Tag className={className}>
      {content}
    </Tag>
  );
};

export default React.memo(ProtectedBalance);