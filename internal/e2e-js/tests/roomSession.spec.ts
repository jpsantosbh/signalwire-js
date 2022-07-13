import { test, expect } from '@playwright/test'
import type { Video } from '@signalwire/js'
import { createTestServer, createTestRoomSession } from '../utils'

test.describe('RoomSession', () => {
  let server: any = null

  test.beforeAll(async () => {
    server = await createTestServer()
    await server.start()
  })

  test.afterAll(async () => {
    await server.close()
  })

  test('should handle joining a room, perform actions and then leave the room', async ({
    page,
  }) => {
    await page.goto(server.url)

    page.on('console', (log) => {
      console.log(log)
    })

    const roomName = 'another'
    await createTestRoomSession(page, {
      vrt: {
        room_name: roomName,
        user_name: 'e2e_test',
        auto_create_room: true,
        permissions: [
          'room.self.audio_mute',
          'room.self.audio_unmute',
          'room.self.video_mute',
          'room.self.video_unmute',
          'room.member.audio_mute',
          'room.member.video_mute',
          'room.member.set_input_volume',
          'room.member.set_output_volume',
          'room.member.set_input_sensitivity',
          'room.member.remove',
          'room.set_layout',
          'room.list_available_layouts',
          'room.recording',
          'room.hide_video_muted',
          'room.show_video_muted',
          'room.playback.seek',
          'room.playback',
        ],
      },
      initialEvents: [
        'member.joined',
        'member.left',
        'member.updated',
        'playback.ended',
        'playback.started',
        'playback.updated',
        'recording.ended',
        'recording.started',
        'room.updated',
      ],
    })

    // --------------- Joining the room ---------------
    const joinParams: any = await page.evaluate(() => {
      return new Promise((r) => {
        // @ts-expect-error
        const roomObj = window._roomObj
        roomObj.on('room.joined', (params: any) => r(params))
        roomObj.join()
      })
    })

    expect(joinParams.room).toBeDefined()
    expect(joinParams.room_session).toBeDefined()
    expect(
      joinParams.room.members.some(
        (member: any) => member.id === joinParams.member_id
      )
    ).toBeTruthy()
    expect(joinParams.room.name).toBe(roomName)

    // Checks that the video is visible
    await page.waitForSelector('div[id^="sw-sdk-"] > video', { timeout: 5000 })

    // --------------- Muting Audio (self) ---------------
    await page.evaluate(
      async ({ joinParams }) => {
        // @ts-expect-error
        const roomObj: Video.RoomSession = window._roomObj

        const memberUpdatedMuted = new Promise((resolve) => {
          roomObj.on('member.updated', (params) => {
            if (
              params.member.id === joinParams.member_id &&
              params.member.updated.includes('audio_muted') &&
              params.member.audio_muted === true
            ) {
              resolve(true)
            }
          })
        })

        const memberUpdatedUnmuted = new Promise((resolve) => {
          roomObj.on('member.updated', (params) => {
            if (
              params.member.id === joinParams.member_id &&
              params.member.updated.includes('audio_muted') &&
              params.member.audio_muted === false
            ) {
              resolve(true)
            }
          })
        })

        await roomObj.audioMute()
        await roomObj.audioUnmute()

        return Promise.all([memberUpdatedMuted, memberUpdatedUnmuted])
      },
      { joinParams }
    )

    // --------------- Muting Video (self) ---------------
    await page.evaluate(
      async ({ joinParams }) => {
        // @ts-expect-error
        const roomObj: Video.RoomSession = window._roomObj

        const memberUpdatedMuted = new Promise((resolve) => {
          roomObj.on('member.updated', (params) => {
            if (
              params.member.id === joinParams.member_id &&
              params.member.updated.includes('video_muted') &&
              params.member.updated.includes('visible') &&
              params.member.video_muted === true &&
              params.member.visible === false
            ) {
              resolve(true)
            }
          })
        })

        const memberUpdatedUnnuted = new Promise((resolve) => {
          roomObj.on('member.updated', (params) => {
            if (
              params.member.id === joinParams.member_id &&
              params.member.updated.includes('video_muted') &&
              params.member.updated.includes('visible') &&
              params.member.video_muted === true &&
              params.member.visible === false
            ) {
              resolve(true)
            }
          })
        })

        await roomObj.videoMute()
        await roomObj.videoUnmute()

        return Promise.all([memberUpdatedMuted, memberUpdatedUnnuted])
      },
      { joinParams }
    )

    // --------------- Session Recording ---------------
    await page.evaluate(async () => {
      // @ts-expect-error
      const roomObj: Video.RoomSession = window._roomObj

      const recordingStarted = new Promise((resolve, reject) => {
        roomObj.on('recording.started', (params) => {
          if (params.state === 'recording') {
            resolve(true)
          } else {
            reject(new Error('[recording.started] state is not "recording"'))
          }
        })
      })

      const roomUpdatedStarted = new Promise((resolve, reject) => {
        roomObj.on('room.updated', (params) => {
          if (
            params.room.recording === true &&
            // The type is incorrectly inferred within this
            // test. `params` is being inferred as
            // `VideoRoomEventParams` instead of
            // `RoomSessionUpdated`
            // @ts-expect-error
            params.room?.updated.includes('recording')
          ) {
            resolve(true)
          } else {
            reject(new Error('[room.updated] state is not "recording"'))
          }
        })
      })

      const recordingEnded = new Promise((resolve, reject) => {
        roomObj.on('recording.ended', (params) => {
          if (params.state === 'completed') {
            resolve(true)
          } else {
            reject(new Error('[recording.ended] state is not "completed"'))
          }
        })
      })

      const recObj = await roomObj.startRecording()

      await new Promise((r) => setTimeout(r, 1000))

      await recObj.stop()

      return Promise.all([recordingStarted, roomUpdatedStarted, recordingEnded])
    })

    // --------------- Playback ---------------
    await page.evaluate(
      async ({ PLAYBACK_URL }) => {
        // @ts-expect-error
        const roomObj: Video.RoomSession = window._roomObj

        const playbackStarted = new Promise((resolve, reject) => {
          roomObj.on('playback.started', (params) => {
            if (params.state === 'playing') {
              resolve(true)
            } else {
              reject(new Error('[playback.started] state is not "recording"'))
            }
          })
        })

        const playbackEnded = new Promise((resolve, reject) => {
          roomObj.on('playback.ended', (params) => {
            if (params.state === 'completed') {
              resolve(true)
            } else {
              reject(new Error('[playback.ended] state is not "completed"'))
            }
          })
        })

        let hasPaused = false
        const playbackPaused = new Promise((resolve) => {
          roomObj.on('playback.updated', (params) => {
            if (params.state === 'paused') {
              hasPaused = true
              resolve(true)
            }
          })
        })

        const playbackResume = new Promise((resolve) => {
          roomObj.on('playback.updated', (params) => {
            if (params.state === 'playing' && hasPaused) {
              resolve(true)
            }
          })
        })

        const playbackVolume = new Promise((resolve) => {
          roomObj.on('playback.updated', (params) => {
            if (params.volume === -50) {
              resolve(true)
            }
          })
        })

        const playbackObj = await roomObj.play({
          url: PLAYBACK_URL!,
        })

        await playbackObj.setVolume(-50)
        await playbackObj.pause()
        await playbackObj.resume()
        await playbackObj.stop()

        return Promise.all([
          playbackStarted,
          playbackVolume,
          playbackEnded,
          playbackPaused,
          playbackResume,
        ])
      },
      { PLAYBACK_URL: process.env.PLAYBACK_URL }
    )

    // --------------- Screenshare ---------------
    await page.evaluate(async () => {
      // @ts-expect-error
      const roomObj: Video.RoomSession = window._roomObj

      let screenMemberId: string
      const screenJoined = new Promise((resolve) => {
        roomObj.on('member.joined', (params: any) => {
          if (params.member.type === 'screen') {
            screenMemberId = params.member.id
            resolve(true)
          }
        })
      })

      const screenLeft = new Promise((resolve) => {
        roomObj.on('member.left', (params) => {
          if (
            params.member.type === 'screen' &&
            params.member.id === screenMemberId
          ) {
            resolve(true)
          }
        })
      })

      const screenShareObj = await roomObj.startScreenShare({
        audio: true,
        video: true,
      })

      await new Promise((r) => setTimeout(r, 2000))

      await screenShareObj.leave()

      return Promise.all([screenJoined, screenLeft])
    })

    // --------------- Leaving the room ---------------
    await page.evaluate(() => {
      // @ts-expect-error
      return window._roomObj.hangup()
    })

    // Checks that all the elements added by the SDK are gone.
    const targetElementsCount = await page.evaluate(() => {
      return {
        videos: Array.from(document.querySelectorAll('video')).length,
        rootEl: document.getElementById('rootElement')!.childElementCount,
      }
    })
    expect(targetElementsCount.videos).toBe(0)
    expect(targetElementsCount.rootEl).toBe(0)
  })
})