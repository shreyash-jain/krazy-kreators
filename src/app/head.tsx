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

      {/* Safari-specific optimizations */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Krazy Kreators" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      
      {/* Safari-specific CSS optimizations */}
      <style 
        precedence="default" 
        href="safari-optimizations"
        dangerouslySetInnerHTML={{
          __html: `
            /* Safari-specific optimizations */
            @supports (-webkit-touch-callout: none) {
              * {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
              }
              
              img, video {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
              }
              
              .group:hover {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
              }
            }
          `
        }} 
      />

      {/* Comprehensive favicon support for all browsers including Safari */}
      <link rel="icon" type="image/x-icon" href="/Logo.ico" />
      <link rel="shortcut icon" type="image/x-icon" href="/Logo.ico" />
      <link rel="icon" type="image/svg+xml" href="/Logo.svg" />
      <link rel="apple-touch-icon" href="/Logo.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/Logo.ico" />
      <meta name="msapplication-TileImage" content="/Logo.ico" />
      <meta name="msapplication-TileColor" content="#6BA292" />
      <meta name="theme-color" content="#6BA292" />
    </>
  );
}