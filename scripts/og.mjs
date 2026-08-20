import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import tagData from '../app/tag-data.json' with { type: 'json' }

const outputFolder = process.env.EXPORT ? 'out' : 'public'
const width = 1200
const height = 630

const fontRegular = readFileSync('./assets/fonts/IBMPlexMono-Regular.ttf')
const fontSemiBold = readFileSync('./assets/fonts/IBMPlexMono-SemiBold.ttf')
const fontBold = readFileSync('./assets/fonts/IBMPlexMono-Bold.ttf')

const fonts = [
  { name: 'IBM Plex Mono', data: fontRegular, weight: 400, style: 'normal' },
  { name: 'IBM Plex Mono', data: fontSemiBold, weight: 600, style: 'normal' },
  { name: 'IBM Plex Mono', data: fontBold, weight: 700, style: 'normal' },
]

function ogTemplate(title) {
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
        backgroundColor: '#1a1b26',
        fontFamily: 'IBM Plex Mono',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'baseline' },
            children: [
              {
                type: 'span',
                props: {
                  style: { color: '#4ab3e8', fontSize: 72, fontWeight: 700, letterSpacing: -1 },
                  children: 'Bit',
                },
              },
              {
                type: 'span',
                props: {
                  style: { color: '#1c9ad6', fontSize: 72, fontWeight: 700, letterSpacing: -1 },
                  children: 'Wise',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 14, marginTop: 26, marginBottom: 26 },
            children: [0.55, 0.75, 1].map((opacity) => ({
              type: 'div',
              props: {
                style: {
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#1c9ad6',
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
              maxWidth: 960,
              textAlign: 'center',
              color: '#c0caf5',
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: -0.5,
              lineHeight: 1.3,
            },
            children: title,
          },
        },
      ],
    },
  }
}

async function renderOgImage(title, outPath) {
  const svg = await satori(ogTemplate(title), { width, height, fonts })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
  const png = resvg.render().asPng()
  mkdirSync(path.dirname(outPath), { recursive: true })
  writeFileSync(outPath, png)
}

async function generateOgImages() {
  const tagKeys = Object.keys(tagData)
  for (const tag of tagKeys) {
    await renderOgImage(tag, path.join(outputFolder, 'static', 'og', 'tags', `${tag}.png`))
  }
  await renderOgImage('Blog', path.join(outputFolder, 'static', 'og', 'blog.png'))
  await renderOgImage('Tags', path.join(outputFolder, 'static', 'og', 'tags.png'))
}

const og = async () => {
  await generateOgImages()
  console.log('OG images generated...')
}
export default og
