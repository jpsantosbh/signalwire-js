import { test, expect } from '@playwright/test'
import type { Video } from '@signalwire/js'
import {
  SERVER_URL,
  createTestRoomSession,
  enablePageLogs,
  randomizeRoomName,
  expectInteractivityMode,
} from '../utils'

test.describe('Self AudioMute test', () => {
  test('should handle joining a room with two members, and muting and unmuting themselves', async ({ context }) => {
    const pageOne = await context.newPage()
    enablePageLogs(pageOne, '[pageOne]')
    const pageTwo = await context.newPage()
    enablePageLogs(pageTwo, '[pageTwo]')

    await Promise.all([pageOne.goto(SERVER_URL), pageTwo.goto(SERVER_URL)])

    const roomName = randomizeRoomName()
    const participant1Settings = {
      vrt: {
        room_name: roomName,
        user_name: 'e2e_participant_1',
        auto_create_room: true,
        permissions: [
          'room.self.audio_mute',
          'room.self.audio_unmute'
        ],
      },
      initialEvents: ['member.joined', 'member.updated', 'member.left'],
    }

    const participant2Settings = {
      vrt: {
        room_name: roomName,
        user_name: 'e2e_participant_2',
        auto_create_room: true,
        permissions: [
          'room.self.audio_mute',
          'room.self.audio_unmute'
        ],
      },
      initialEvents: ['member.joined', 'member.updated', 'member.left'],
    }

    await Promise.all([
      createTestRoomSession(pageOne, participant1Settings),
      createTestRoomSession(pageTwo, participant2Settings),
    ])

    // --------------- Joining the room ---------------
    const joinParams1: any = await pageOne.evaluate(() => {
      return new Promise((response) => {
        // @ts-expect-error
        const roomObj = window._roomObj
        roomObj.on('room.joined', (params: any) => response(params))
        roomObj.join()
      })
    })

    await expectInteractivityMode(pageOne, 'member')
    await pageOne.waitForSelector('div[id^="sw-sdk-"] > video', {
      timeout: 5000,
    })
    await pageOne.waitForTimeout(5000)

    const joinParams2: any = await pageTwo.evaluate(() => {
      return new Promise((response) => {
        // @ts-expect-error
        const roomObj = window._roomObj
        roomObj.on('room.joined', (params: any) => response(params))
        roomObj.join()
      })
    })

    await expectInteractivityMode(pageTwo, 'member')
    await pageTwo.waitForSelector('div[id^="sw-sdk-"] > video', {
      timeout: 5000,
    })
    await pageTwo.waitForTimeout(5000)

    // --------------- Muting Audio (self) ---------------
    await pageOne.evaluate(
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
      { joinParams: joinParams1 }
    )

    await pageTwo.evaluate(
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
      { joinParams: joinParams2 }
    )

    // --------------- Leaving the room ---------------
    await Promise.all([
      // @ts-expect-error
      pageOne.evaluate(() => window._roomObj.leave()),
      // @ts-expect-error
      pageTwo.evaluate(() => window._roomObj.leave()),
    ])
  })
})
