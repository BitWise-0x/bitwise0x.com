import siteMetadata from '@/data/siteMetadata'
import Link from './Link'

export default function Footer() {
  return (
    <footer className="ledger-footer col-span-full mt-4 md:pl-9">
      <span>{`© BitWise · ${new Date().getFullYear()}`}</span>
      <span className="flex gap-3">
        <Link href={siteMetadata.github}>GitHub</Link>
        <span aria-hidden="true">·</span>
        <Link href={siteMetadata.x}>X</Link>
        <span aria-hidden="true">·</span>
        <Link href={siteMetadata.bluesky}>Bluesky</Link>
      </span>
    </footer>
  )
}
