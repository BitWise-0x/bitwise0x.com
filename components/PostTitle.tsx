// post titles follow a "Name: subtitle" pattern; break the line right after
// the first colon so the subtitle sits on its own line instead of running on.
export default function PostTitle({ title }: { title: string }) {
  const i = title.indexOf(':')
  if (i === -1) return <h1>{title}</h1>

  const head = title.slice(0, i + 1)
  const rest = title.slice(i + 1).trim()
  return (
    <h1>
      {head}
      <br />
      {rest}
    </h1>
  )
}
