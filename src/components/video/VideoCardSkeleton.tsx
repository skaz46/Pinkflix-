import clsx from 'clsx'

export function VideoCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'row' }) {
  return (
    <div className={clsx(variant === 'row' ? 'w-[168px] sm:w-[200px] shrink-0' : 'w-full')}>
      <div className="skeleton aspect-video w-full rounded-2xl" />
      <div className="mt-2.5 px-0.5 space-y-1.5">
        <div className="skeleton h-3.5 w-4/5 rounded-full" />
        <div className="skeleton h-2.5 w-2/5 rounded-full" />
      </div>
    </div>
  )
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} variant="row" />
      ))}
    </div>
  )
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}
