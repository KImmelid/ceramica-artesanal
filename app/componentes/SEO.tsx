export default function SEO({ title, description }: { title: string; description: string }) {
  return (
    <>
      <title>{title} | Cerámica Artesanal</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </>
  );
}


