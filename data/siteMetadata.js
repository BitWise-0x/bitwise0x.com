/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'BitWise | Intelligent Backends',
  author: 'Rob@BitWise',
  headerTitle: '',
  description:
    'BitWise: backend engineering, distributed systems, and infrastructure. Projects, tools, and writing from real-world work.',
  language: 'en-US',
  theme: 'dark', // system, dark or light
  siteUrl: 'https://bitwise0x.com',
  siteRepo: 'https://github.com/BitWise-0x/bitwise0x.com',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.svg`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/social-banner.png`,
  email: 'rob@bitwise0x.com',
  github: 'https://github.com/BitWise-0x',
  x: 'https://x.com/BitWise_0x',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: true,
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // Served first-party through the Cloudflare Worker in workers/proxy so
      // content blockers matching cloud.umami.is do not strip it. Falls back to
      // the cloud endpoints when the proxy env vars are unset (local dev).
      src: process.env.NEXT_UMAMI_SRC || 'https://cloud.umami.is/script.js',
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      umamiHostUrl: process.env.NEXT_UMAMI_HOST_URL, // first-party beacon base, e.g. https://bitwise0x.com/i
      // Core Web Vitals per visitor. pliny spreads these through as data-* on
      // the script tag. See docs/umami-analytics.md for the full attribute set.
      dataPerformance: 'true',
      // TOC anchor links otherwise register as a separate pageview per heading.
      dataExcludeHash: 'true',
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '',
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '',
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    provider: 'buttondown',
  },
  comments: {
    // If you want to use a comments provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit https://giscus.app/ and follow the steps in the 'configuration' section
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      metadata: '0',
      theme: 'dark',
      darkTheme: 'dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   appId: '',
    //   apiKey: '',
    //   indexName: '',
    // },
  },
}

module.exports = siteMetadata
