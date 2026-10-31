import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import tagData from '../app/tag-data.json' with { type: 'json' }

const outputFolder = process.env.EXPORT ? 'out' : 'public'
const width = 1200
const height = 630

// Ledger palette, kept in step with css/tailwind.css dark theme.
const BG = '#0c0f0e'
const FG = '#e7ece8'
const MUTED = '#8a938f'
const LINE = '#1f2623'
const SIGNAL = '#4ab3e8'

const fontRegular = readFileSync('./assets/fonts/IBMPlexMono-Regular.ttf')
const fontSemiBold = readFileSync('./assets/fonts/IBMPlexMono-SemiBold.ttf')
const fontBold = readFileSync('./assets/fonts/IBMPlexMono-Bold.ttf')

const fonts = [
  { name: 'IBM Plex Mono', data: fontRegular, weight: 400, style: 'normal' },
  { name: 'IBM Plex Mono', data: fontSemiBold, weight: 600, style: 'normal' },
  { name: 'IBM Plex Mono', data: fontBold, weight: 700, style: 'normal' },
]

// The 0x glyph in its bordered rounded box, mirroring .topnav .mark .glyph.
function glyph(size) {
  return {
    type: 'div',
    props: {
      style: {
        width: size,
        height: size,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `${Math.round(size * 0.06)}px solid ${FG}`,
        borderRadius: Math.round(size * 0.2),
        color: FG,
        fontSize: Math.round(size * 0.46),
        fontWeight: 600,
      },
      children: '0x',
    },
  }
}

// The lockup used on every card: [0x] BitWise.
function lockup(glyphSize, wordSize) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: Math.round(glyphSize * 0.4) },
      children: [
        glyph(glyphSize),
        {
          type: 'div',
          props: {
            style: { color: FG, fontSize: wordSize, fontWeight: 600, letterSpacing: -1 },
            children: 'BitWise',
          },
        },
      ],
    },
  }
}

// Homepage / default social card: centered mark, signal dots, tagline.
function bannerTemplate() {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BG,
        fontFamily: 'IBM Plex Mono',
      },
      children: [
        lockup(112, 104),
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 16, marginTop: 30, marginBottom: 30 },
            children: [0.4, 0.7, 1].map((opacity) => ({
              type: 'div',
              props: {
                style: {
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  backgroundColor: SIGNAL,
                  opacity,
                  display: 'flex',
                },
              },
            })),
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              color: MUTED,
              fontSize: 26,
              fontWeight: 400,
              letterSpacing: 8,
            },
            children: 'INTELLIGENT BACKENDS',
          },
        },
      ],
    },
  }
}

// Section / tag / listing card: mark top-left, title set large below a rule.
function titleTemplate(title) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BG,
        fontFamily: 'IBM Plex Mono',
        padding: 80,
      },
      children: [
        lockup(72, 52),
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 96,
                    height: 4,
                    backgroundColor: SIGNAL,
                    marginBottom: 28,
                    display: 'flex',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    maxWidth: 1000,
                    color: FG,
                    fontSize: 72,
                    fontWeight: 600,
                    letterSpacing: -1,
                    lineHeight: 1.1,
                  },
                  children: title,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              borderTop: `1px solid ${LINE}`,
              paddingTop: 20,
              color: MUTED,
              fontSize: 22,
              letterSpacing: 4,
            },
            children: 'BITWISE0X.COM',
          },
        },
      ],
    },
  }
}

async function render(node, outPath) {
  const svg = await satori(node, { width, height, fonts })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
  const png = resvg.render().asPng()
  mkdirSync(path.dirname(outPath), { recursive: true })
  writeFileSync(outPath, png)
}

async function generateOgImages() {
  // The default social banner feeds siteMetadata.socialBanner, so it must be
  // regenerated here rather than left as a hand-made static that drifts.
  await render(bannerTemplate(), path.join(outputFolder, 'static', 'images', 'social-banner.png'))

  for (const tag of Object.keys(tagData)) {
    await render(titleTemplate(tag), path.join(outputFolder, 'static', 'og', 'tags', `${tag}.png`))
  }
  await render(titleTemplate('Blog'), path.join(outputFolder, 'static', 'og', 'blog.png'))
  await render(titleTemplate('Tags'), path.join(outputFolder, 'static', 'og', 'tags.png'))
}

const og = async () => {
  await generateOgImages()
  console.log('OG images generated...')
}
export default og
