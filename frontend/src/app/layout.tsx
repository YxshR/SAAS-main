import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ToastProvider } from "@/components/ui/toast";
import { baseSEO, structuredData, performanceSEO } from "@/lib/seo";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: baseSEO.title,
    template: `%s | ${baseSEO.title}`,
  },
  description: baseSEO.description,
  keywords: baseSEO.keywords.join(', '),
  authors: [{ name: baseSEO.author }],
  creator: baseSEO.author,
  publisher: baseSEO.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseSEO.url,
    siteName: baseSEO.siteName,
    title: baseSEO.title,
    description: baseSEO.description,
    images: [
      {
        url: `${baseSEO.url}${baseSEO.image}`,
        width: 1200,
        height: 630,
        alt: baseSEO.title,
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@aisummarizer',
    creator: '@aisummarizer',
    title: baseSEO.title,
    description: baseSEO.description,
    images: [`${baseSEO.url}${baseSEO.image}`],
  },
  
  // Icons and manifest
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: baseSEO.themeColor },
    ],
  },
  manifest: '/manifest.json',
  
  // Additional meta tags
  other: {
    'theme-color': baseSEO.themeColor,
    'msapplication-TileColor': baseSEO.themeColor,
    'msapplication-config': '/browserconfig.xml',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': baseSEO.title,
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'application-name': baseSEO.title,
  },
  
  // Verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
  
  // Category
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: baseSEO.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains */}
        {performanceSEO.resourceHints.map((hint, index) => (
          <link
            key={index}
            rel={hint.rel}
            href={hint.href}
            crossOrigin={hint.crossOrigin as "anonymous" | "use-credentials" | undefined}
          />
        ))}
        
        {/* Preload critical resources */}
        {performanceSEO.preloadResources.map((resource, index) => (
          <link
            key={index}
            rel="preload"
            href={resource.href}
            as={resource.as}
            type={resource.type}
            crossOrigin={resource.crossOrigin as "anonymous" | "use-credentials" | undefined}
          />
        ))}
        
        {/* Critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: performanceSEO.criticalCSS }} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.organization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.website),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.softwareApplication),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        <ErrorBoundary name="RootLayout" level="page">
          <ThemeProvider>
            <QueryProvider>
              <ToastProvider>
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
              </ToastProvider>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
        
        {/* Analytics and performance monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                  strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                      page_title: document.title,
                      page_location: window.location.href,
                    });
                  `}
                </Script>
              </>
            )}
            
            {/* Web Vitals reporting */}
            <Script id="web-vitals" strategy="afterInteractive">
              {`
                function sendToAnalytics(metric) {
                  if (window.gtag) {
                    gtag('event', metric.name, {
                      event_category: 'Web Vitals',
                      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                      event_label: metric.id,
                      non_interaction: true,
                    });
                  }
                }
                
                import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                  getCLS(sendToAnalytics);
                  getFID(sendToAnalytics);
                  getFCP(sendToAnalytics);
                  getLCP(sendToAnalytics);
                  getTTFB(sendToAnalytics);
                });
              `}
            </Script>
          </>
        )}
        
        {/* Service Worker registration */}
        <Script id="service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
