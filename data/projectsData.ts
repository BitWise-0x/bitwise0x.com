interface Project {
  title: string
  tagline?: string
  description: string
  href?: string
  imgSrc?: string
  // basename of <name>.av1.mp4, <name>.h264.mp4 and the poster <name>.jpg (the loop's first frame)
  videoSrc?: string
  learnMoreHref?: string
  comingSoon?: boolean
}

const projectsData: Project[] = [
  {
    title: 'FleetBit',
    tagline: 'Fleet orchestration platform',
    description: `A hosted platform for orchestrating your fleets. Dispatch orders, follow drivers
    and vehicles on a live map, plan routes, and keep maintenance and billing in the same console.`,
    imgSrc: '/static/images/blog/fleetbit/landing.jpg',
    videoSrc: '/static/videos/projects/fleetbit',
    href: 'https://fleetbit.co',
    comingSoon: true,
  },
  {
    title: 'EchoSonic',
    tagline: 'Ai music generation platform',
    description: `An Ai music service that treats each generated track as a draft rather than a final
    render. You can rework one section at a time, change the arrangement or style, and have the
    song sung in your own voice.`,
    imgSrc: '/static/images/blog/echosonic/landing.jpg',
    videoSrc: '/static/videos/projects/echosonic',
    href: 'https://echosonic.io',
    learnMoreHref: '/blog/introducing-echosonic',
  },
  {
    title: 'CarlJung.ai',
    tagline: 'Voice reflection with a Jungian persona',
    description: `Self-reflection through spoken conversation with a Carl Jung persona. It listens to how
    you speak as well as what you say, and uses Jung's path of individuation to give each session
    a direction.`,
    imgSrc: '/static/images/blog/carljung/landing.jpg',
    videoSrc: '/static/videos/projects/carljung',
    href: 'https://carljung.ai',
    learnMoreHref: '/blog/introducing-carljung-ai',
  },
  {
    title: 'Open WebUI Ultimate Stack',
    tagline: 'Production Open WebUI deployment stack',
    description: `A production deployment of Open WebUI for Docker Compose and Swarm. It bundles RAG,
    private web search, OCR, local text-to-speech, and MCP tool servers, and installs a curated
    library of tools, filters, and pipes on every deploy.`,
    imgSrc: '/static/images/blog/open-webui-ultimate-stack/hero.jpg',
    href: 'https://github.com/BitWise-0x/open-webui-ultimate-stack',
    learnMoreHref: '/blog/open-webui-ultimate-stack',
  },
  {
    title: 'Homebridge SmartRent Plugin',
    tagline: 'HomeKit integration for SmartRent',
    description: `A Homebridge plugin that brings SmartRent locks, thermostats, and switches into
    Apple Home, so they work alongside the rest of your HomeKit devices.`,
    imgSrc: '/static/images/blog/homebridge-smartrent-blink/smartrent-devices.png',
    href: 'https://github.com/BitWise-0x/homebridge-smartrent',
    learnMoreHref: '/blog/homebridge-smartrent-blink',
  },
  {
    title: 'Homebridge Blink Security',
    tagline: 'HomeKit integration for Blink cameras',
    description: `A Homebridge plugin for Blink cameras, doorbells, and sirens. It adds live view,
    motion events, snapshots, and arming to Apple Home, and can deliver doorbell presses within a
    second or two through Blink's push notifications, even without a Blink subscription.`,
    imgSrc: '/static/images/blog/homebridge-smartrent-blink/homebridge-banner.png',
    href: 'https://github.com/BitWise-0x/homebridge-blink-security',
    learnMoreHref: '/blog/homebridge-smartrent-blink',
  },
  {
    title: 'MongoDB Replica Set Manager',
    tagline: 'MongoDB replica sets for Docker Swarm',
    description: `A replica set controller for MongoDB on Docker Swarm. It handles the initial
    deployment, adjusts membership as the service scales, and recovers from node failures
    without manual intervention.`,
    imgSrc: '/static/images/blog/mongodb-replica-set-manager/server-rack.jpg',
    href: 'https://github.com/BitWise-0x/MongoDB-ReplicaSet-Manager',
    learnMoreHref: '/blog/mongodb-replica-set-manager',
  },
]

export default projectsData
