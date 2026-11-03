import { ReactNode } from 'react'

interface Props {
  kicker: ReactNode
  title: ReactNode
  // the nav already names most pages, so the title is screen-reader only unless it adds context
  showTitle?: boolean
  aside?: ReactNode
  children?: ReactNode
}

export default function LedgerLead({ kicker, title, showTitle = false, aside, children }: Props) {
  return (
    <section className={showTitle ? 'ledger-lead' : 'ledger-lead no-title'}>
      <p className="kicker">
        <span className="led-pulse" />
        {kicker}
      </p>
      <h1 className={showTitle ? undefined : 'sr-only'}>{title}</h1>
      {(children || aside) && (
        <p className="lead-sub">
          <span>{children}</span>
          {aside && <span className="lead-aside">{aside}</span>}
        </p>
      )}
    </section>
  )
}
