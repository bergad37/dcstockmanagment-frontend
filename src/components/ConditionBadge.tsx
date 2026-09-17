import Badge from './Badge';
import type { ProductCondition } from '../types/product';

const variants: Record<ProductCondition, 'success' | 'warning' | 'default'> = {
  NEW: 'success',
  SECOND_HAND: 'warning',
  OLD: 'default'
};

const ConditionBadge = ({ condition }: { condition?: string | null }) => {
  if (!condition) return <span className="text-gray-300">—</span>;

  return (
    <Badge
      label={condition.replace(/_/g, ' ')}
      variant={variants[condition as ProductCondition] ?? 'default'}
    />
  );
};

export default ConditionBadge;
