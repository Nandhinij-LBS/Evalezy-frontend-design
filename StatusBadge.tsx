interface StatusBadgeProps {
  label: string
  tone?: 'warning' | 'success' | 'neutral'
}

const toneClasses: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  warning: 'bg-amber-100 text-amber-700',
  success: 'bg-green-100 text-green-700',
  neutral: 'bg-gray-100 text-gray-600',
}

export default function StatusBadge({ label, tone = 'warning' }: StatusBadgeProps) {
  return (
    <span className={`inline-block text-[8px] font-medium px-2 py-0.5 rounded-full ${toneClasses[tone]}`}>
      {label}
    </span>
  )
}