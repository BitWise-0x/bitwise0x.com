import rss from './rss.mjs'
import og from './og.mjs'
import versionAssets from './version-assets.mjs'

async function postbuild() {
  await rss()
  await og()
  versionAssets()
}

postbuild()
