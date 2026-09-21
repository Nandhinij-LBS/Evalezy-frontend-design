interface HeroBannerProps {
  compact?: boolean
}

export default function HeroBanner({ compact = false }: HeroBannerProps) {
  return (
    <div className={`overflow-hidden rounded-b-[50px] ${compact ? 'max-h-[180px]' : ''}`}>
      <img
        src="/Container.png"
        alt="Boost Engagement, Drive Excellence — PMS"
        className="w-full h-auto object-cover"
      />
    </div>
  )
}