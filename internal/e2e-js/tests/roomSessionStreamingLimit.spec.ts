import { test, expect } from '../fixtures'
import type { Video } from '@signalwire/js'
import {
  SERVER_URL,
  createTestRoomSession,
  expectRoomJoined,
  expectMCUVisible,
  randomizeRoomName,
} from '../utils'

test.describe('RoomSession', () => {
  test('should handle reaching the limit of streams in a room', async ({
    createCustomPage,
  }) => {
    const pageOne = await createCustomPage({ name: '[pageOne]' })

    await Promise.all([
      pageOne.goto(SERVER_URL),
    ])

    const room_name = randomizeRoomName()

    const connectionSettings = {
      vrt: {
        room_name: room_name,
        user_name: 'e2e_stream_limit_test',
        auto_create_room: true,
        permissions: ['room.stream'],
      },
      initialEvents: ['stream.started', 'stream.ended'],
    }

    await Promise.all([
      createTestRoomSession(pageOne, connectionSettings),
    ])

    await expectRoomJoined(pageOne)
    await expectMCUVisible(pageOne)

    const streamingURL = `${process.env.RTMP_SERVER}${process.env.RTMP_STREAM_NAME}`

    // --------------- Start stream from 1st room ---------------
    await pageOne.evaluate(
      async ({ STREAMING_URL }) => {
        // @ts-expect-error
        const roomObj: Video.RoomSession = window._roomObj

        // const streamStarted = new Promise((resolve, reject) => {
        //   roomObj.on('stream.started', (params) => {
        //     if (params.state === 'streaming') {
        //       resolve(true)
        //     } else {
        //       reject(new Error('[stream.started] state is not "stream"'))
        //     }
        //   })
        // })

        await roomObj.startStream({
          url: STREAMING_URL! + '1',
        })
        await roomObj.startStream({
          url: STREAMING_URL! + '2',
        })

        const result = await roomObj.getStreams()

        console.log("result", result)
        // await roomObj.startStream({
        //   url: STREAMING_URL! + '3',
        // })
        // await roomObj.startStream({
        //   url: STREAMING_URL! + '4',
        // })
        // await roomObj.startStream({
        //   url: STREAMING_URL! + '5',
        // })

        // // TODO: Expect 409 here
        // await roomObj.startStream({
        //   url: STREAMING_URL! + '6',
        // })

        // return streamStarted
      },
      { STREAMING_URL: streamingURL}
    )

  })
})
