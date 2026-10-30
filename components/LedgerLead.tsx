import { ReactNode } from 'react'

interface Props {
  kicker: ReactNode
  title: ReactNode
  children?: ReactNode
}

export default function LedgerLead({ kicker, title, children }: Props) {
  return (
    <section className="ledger-lead">
      <p className="kicker">
        <span className="led-pulse" />
        {kicker}
      </p>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </section>
  )
}
