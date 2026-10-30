import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <p>The link to the target route is rendered below the fold.</p>
      {/*
        The spacers push the link several screens down. The router prefetches
        links within 200px of the viewport, so the gap between the checkpoint
        and the link must be much larger than that: scrolling the checkpoint
        into view has to leave the link outside the viewport.
      */}
      <div style={{ height: '300vh' }} />
      <div id="checkpoint">Checkpoint</div>
      <div style={{ height: '300vh' }} />
      <Link href="/target">Target page</Link>
    </main>
  )
}
