'use client';

import Script from 'next/script';

const GoogleAnalytics = ({ gaId: rawGaId }) => {
  const gaId = rawGaId?.trim();
  if (!gaId) {
    console.warn('Google Analytics Measurement ID is missing.');
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
