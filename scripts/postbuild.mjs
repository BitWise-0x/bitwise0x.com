import rss from './rss.mjs'
import og from './og.mjs'

async function postbuild() {
  await rss()
  await og()
}

postbuild()
