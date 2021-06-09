// Importing directly from `@signalwire/js` will take the
// `production` bundle while importing from `../../src` will
// hot-reload as we make changes.

import { Video } from '../../src'

// @ts-ignore
window._makeClient = async ({ token, emitter }) => {
  try {
    const client = await Video.createClient({
      host: 'relay.swire.io',
      token,
      autoConnect: false,
      emitter,
    })

    client.on('session.disconnected', console.warn)
    client.on('session.connected', console.warn)

    // @ts-ignore
    window.__client = client

    return client
  } catch (error) {
    console.error('Error?', error)
  }
}