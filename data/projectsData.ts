interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'HumeChat',
    description: `Expressive Voice Intelligence platform powered by Hume AI EVI. Real-time
    voice conversations with multi-persona AI, Jungian archetype assessments, emotion
    detection, and 3D audio visualizations.`,
    imgSrc: '/static/images/projects/humechat.svg',
    href: 'https://humechat.com',
  },
  {
    title: 'MongoDB Replica Set Manager',
    description: `Production-ready MongoDB replica set controller for Docker Swarm.
    Automates deployment, scaling, and failover of MongoDB clusters in containerized
    environments with high availability guarantees.`,
    imgSrc: '/static/images/projects/mongodb-manager.svg',
    href: 'https://github.com/BitWise-0x/MongoDB-ReplicaSet-Manager',
  },
  {
    title: 'Homebridge SmartRent Plugin',
    description: `Homebridge plugin enabling full HomeKit integration for SmartRent
    smart home installations. Control locks, thermostats, and switches natively
    through Apple Home.`,
    imgSrc: '/static/images/projects/homebridge-smartrent.svg',
    href: 'https://github.com/BitWise-0x/homebridge-smartrent',
  },
  {
    title: 'Homebridge Blink Security',
    description: `Homebridge plugin for Amazon Blink cameras, doorbells, and sirens.
    Brings live view, motion detection, snapshots, and arm/disarm control into
    Apple Home via HomeKit with OAuth 2.0, 2FA, and multi-network support.`,
    imgSrc: '/static/images/projects/homebridge-blink.svg',
    href: 'https://github.com/BitWise-0x/homebridge-blink-security',
  },
  {
    title: 'Open WebUI Ultimate Stack',
    description: `Production-ready Open WebUI deployment with RAG, private web search,
    OCR, local TTS, and MCP tool servers. Ships as Docker Compose and Docker Swarm stacks
    with a curated library of tools, filters, and function pipes auto-deployed on every deploy.`,
    imgSrc: '/static/images/projects/open-webui-stack.svg',
    href: 'https://github.com/BitWise-0x/open-webui-ultimate-stack',
  },
]

export default projectsData
