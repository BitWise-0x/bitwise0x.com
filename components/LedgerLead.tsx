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
        {aside && <span className="kicker-aside">{aside}</span>}
      </p>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </section>
  )
}
