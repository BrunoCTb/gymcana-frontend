type PlaceholderPageProps = {
  title: string
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main>
      <h1>{title}</h1>
      <p>Esta funcionalidade será desenvolvida em breve.</p>
    </main>
  )
}

export default PlaceholderPage