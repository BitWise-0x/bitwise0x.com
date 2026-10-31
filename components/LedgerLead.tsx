import { ReactNode } from 'react'

interface Props {
  kicker: ReactNode
  title: ReactNode
  aside?: ReactNode
  children?: ReactNode
}

export default function LedgerLead({ kicker, title, aside, children }: Props) {
  return (
    <section className="ledger-lead">
      <p className="kicker">
        <span className="led-pulse" />
        {kicker}
      </p>
      <h1>{title}</h1>
      {(children || aside) && (
        <p className="lead-sub">
          <span>{children}</span>
          {aside && <span className="lead-aside">{aside}</span>}
        </p>
      )}
    </section>
  )
}
