import Link from '@/components/Link'
import { Metadata } from 'next'
import LedgerLead from '@/components/LedgerLead'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div>
      <LedgerLead kicker="Error 404" title="Not found">
        That page does not exist, or it moved, but everything else is still where you left it
      </LedgerLead>

      <div className="ledger-pager">
        <Link href="/">&larr; Back to homepage</Link>
      </div>
    </div>
  )
}
