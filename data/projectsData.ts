interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  learnMoreHref?: string
}

const projectsData: Project[] = [
  {
    title: 'CarlJung.ai',
    description: `Voice reflection sessions with a Carl Jung persona, built on an empathic
    voice AI interface. PMAI-style archetype assessment, real-time emotion detection across
    48 categories, and a four-stage individuation journey with AI-generated reflection notes.`,
    imgSrc: '/static/images/blog/carljung/jung-banner.jpg',
    href: 'https://carljung.ai',
    learnMoreHref: '/blog/introducing-carljung-ai',
  },
  {
    title: 'Open WebUI Ultimate Stack',
    description: `Production-ready Open WebUI deployment with RAG, private web search,
    OCR, local TTS, and MCP tool servers. Ships as Docker Compose and Docker Swarm stacks
    with a curated library of tools, filters, and function pipes auto-deployed on every deploy.`,
    imgSrc: '/static/images/blog/open-webui-ultimate-stack/hero.jpg',
    href: 'https://github.com/BitWise-0x/open-webui-ultimate-stack',
    learnMoreHref: '/blog/open-webui-ultimate-stack',
  },
  {
    title: 'Homebridge SmartRent Plugin',
    description: `Homebridge plugin enabling full HomeKit integration for SmartRent
    smart home installations. Control locks, thermostats, and switches natively
    through Apple Home.`,
    imgSrc: '/static/images/blog/homebridge-smartrent-blink/smartrent-devices.png',
    href: 'https://github.com/BitWise-0x/homebridge-smartrent',
    learnMoreHref: '/blog/homebridge-smartrent-blink',
  },
  {
    title: 'Homebridge Blink Security',
    description: `Homebridge plugin for Amazon Blink cameras, doorbells, and sirens.
    Brings live view, motion detection, snapshots, and arm/disarm control into
    Apple Home via HomeKit with OAuth 2.0, 2FA, and multi-network support.`,
    imgSrc: '/static/images/blog/homebridge-smartrent-blink/homebridge-banner.png',
    href: 'https://github.com/BitWise-0x/homebridge-blink-security',
    learnMoreHref: '/blog/homebridge-smartrent-blink',
  },
  {
    title: 'MongoDB Replica Set Manager',
    description: `Production-ready MongoDB replica set controller for Docker Swarm.
    Automates deployment, scaling, and failover of MongoDB clusters in containerized
    environments with high availability guarantees.`,
    imgSrc: '/static/images/blog/mongodb-replica-set-manager/server-rack.jpg',
    href: 'https://github.com/BitWise-0x/MongoDB-ReplicaSet-Manager',
    learnMoreHref: '/blog/mongodb-replica-set-manager',
  },
]

export default projectsData
