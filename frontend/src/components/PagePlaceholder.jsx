function PagePlaceholder({ title, note }) {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>{title}</h1>
      <p>{note}</p>
    </main>
  );
}

export default PagePlaceholder;
