
import pwa from "@ducanh2912/next-pwa";

const withPWA = pwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }
      }
    }
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  devIndicators: {
    allowedDevOrigins: [
      "https://*.cloudworkstations.dev",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
   async headers() {
    return [
      {
        source: '/:all*(ico|svg|jpg|jpeg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default withPWA(nextConfig);
