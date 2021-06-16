import { createWebSocketClient } from '@signalwire/node'

createWebSocketClient({
  host: 'relay.swire.io',
  project: '<project-id>',
  token: '<project-token>',
})
  .then((c) => {
    c.connect()
    c.on('session.connected', () => {
      console.log('Connected!')
    })
  })
  .catch((e) => {
    console.log('<Error>', e)
  })