import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { EmptyState } from '../components/common/EmptyState'

export function NotFound() {
  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-16">
        <EmptyState
          icon={<Compass size={24} />}
          title="Page not found"
          description="The page you're looking for doesn't exist."
          action={
            <Link
              to="/"
              className="focus-ring rounded-full bg-accent-500 hover:bg-accent-600 text-white text-[13.5px] font-semibold px-4 py-2 transition-colors"
            >
              Back to Home
            </Link>
          }
        />
      </div>
    </PageTransition>
  )
}
