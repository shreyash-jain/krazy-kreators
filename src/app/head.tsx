export default function Head() {
  return (
    <>
      {/* Preconnects to reduce render-blocking and connection setup time */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      {/* Static origin preconnect (same-origin is implicit, but okay for hinting) */}
      <link rel="preconnect" href="https://krazykreators.com" />
      <link rel="dns-prefetch" href="https://krazykreators.com" />
    </>
  );
}


