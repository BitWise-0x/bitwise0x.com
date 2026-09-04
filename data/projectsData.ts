interface Project {
  title: string
  tagline?: string
  description: string
  href?: string
  imgSrc?: string
  learnMoreHref?: string
}

const projectsData: Project[] = [
  {
    title: 'EchoSonic',
    tagline: 'Ai music generation platform',
    description: `Ai music platform that turns one sentence into a finished track, then
    hands you a studio to keep shaping it. Repaint a passage, add a layer, morph the
    style, pull the mix into stems, and clone your own voice to sing it in any language.`,
    imgSrc: '/static/images/blog/echosonic/hero.jpg',
    href: 'https://echosonic.io',
    learnMoreHref: '/blog/introducing-echosonic',
  },
  {
    title: 'CarlJung.ai',
    tagline: 'Voice reflection with a Jungian persona',
    description: `Voice reflection sessions with a Carl Jung persona that hears how you say
    things, not just what you say. Archetype assessment, emotion read live from the voice,
    and a four-stage individuation journey with reflection notes after every session.`,
    imgSrc: '/static/images/blog/carljung/jung-banner.jpg',
    href: 'https://carljung.ai',
    learnMoreHref: '/blog/introducing-carljung-ai',
  },
  {
    title: 'Open WebUI Ultimate Stack',
    tagline: 'Production Open WebUI deployment stack',
    description: `Production-ready Open WebUI deployment with RAG, private web search,
    OCR, local TTS, and MCP tool servers. Ships as Docker Compose and Docker Swarm stacks
    with a curated library of tools, filters, and function pipes auto-deployed on every deploy.`,
    imgSrc: '/static/images/blog/open-webui-ultimate-stack/hero.jpg',
    href: 'https://github.com/BitWise-0x/open-webui-ultimate-stack',
    learnMoreHref: '/blog/open-webui-ultimate-stack',
  },
  {
    title: 'Homebridge SmartRent Plugin',
    tagline: 'HomeKit integration for SmartRent',
    description: `Homebridge plugin enabling full HomeKit integration for SmartRent
    smart home installations. Control locks, thermostats, and switches natively
    through Apple Home.`,
    imgSrc: '/static/images/blog/homebridge-smartrent-blink/smartrent-devices.png',
    href: 'https://github.com/BitWise-0x/homebridge-smartrent',
    learnMoreHref: '/blog/homebridge-smartrent-blink',
  },
  {
    title: 'Homebridge Blink Security',
    tagline: 'HomeKit integration for Blink cameras',
    description: `Homebridge plugin for Amazon Blink cameras, doorbells, and sirens.
    Brings live view, motion detection, snapshots, and arm/disarm control into
    Apple Home via HomeKit with OAuth 2.0, 2FA, and multi-network support.`,
    imgSrc: '/static/images/blog/homebridge-smartrent-blink/homebridge-banner.png',
    href: 'https://github.com/BitWise-0x/homebridge-blink-security',
    learnMoreHref: '/blog/homebridge-smartrent-blink',
  },
  {
    title: 'MongoDB Replica Set Manager',
    tagline: 'MongoDB replica sets for Docker Swarm',
    description: `Production-ready MongoDB replica set controller for Docker Swarm.
    Automates deployment, scaling, and failover of MongoDB clusters in containerized
    environments with high availability guarantees.`,
    imgSrc: '/static/images/blog/mongodb-replica-set-manager/server-rack.jpg',
    href: 'https://github.com/BitWise-0x/MongoDB-ReplicaSet-Manager',
    learnMoreHref: '/blog/mongodb-replica-set-manager',
  },
]

export default projectsData
