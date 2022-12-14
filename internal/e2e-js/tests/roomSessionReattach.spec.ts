import { test, expect } from '@playwright/test'
import type { Video } from '@signalwire/js'
import {
  SERVER_URL,
  createTestRoomSession,
  enablePageLogs,
  randomizeRoomName,
} from '../utils'

test.describe('RoomSessionReattach', () => {
  test('should handle joining a room, reattaching and then leave the room', async ({
    page,
  }) => {
    await page.goto(SERVER_URL)
    enablePageLogs(page)

    const roomName = randomizeRoomName()
    const permissions = [
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
      'room.playback_seek',
      'room.playback',
      'room.set_meta',
      'room.member.set_meta',
    ]
    await createTestRoomSession(page, {
      vrt: {
        room_name: roomName,
        user_name: 'e2e_reattach_test',
        auto_create_room: true,
        permissions,
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
    expect(joinParams.room_session.name).toBe(roomName)
    expect(joinParams.room.name).toBe(roomName)

    // Checks that the video is visible
    await page.waitForSelector('div[id^="sw-sdk-"] > video', { timeout: 5000 })

    const roomPermissions: any = await page.evaluate(() => {
      // @ts-expect-error
      const roomObj: Video.RoomSession = window._roomObj
      return roomObj.permissions
    })
    expect(roomPermissions).toStrictEqual(permissions)

    // --------------- Reattaching ---------------
    await page.reload()

    await createTestRoomSession(page, {
      vrt: {
        room_name: roomName,
        user_name: 'e2e_reattach_test',
        auto_create_room: true,
        permissions,
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

    // Join again
    const reattachParams: any = await page.evaluate(() => {
      return new Promise((r) => {
        // @ts-expect-error
        const roomObj = window._roomObj
        roomObj.on('room.joined', (params: any) => r(params))
        roomObj.join()
      })
    })

    expect(reattachParams.room).toBeDefined()
    expect(reattachParams.room_session).toBeDefined()
    expect(
      reattachParams.room.members.some(
        (member: any) => member.id === reattachParams.member_id
      )
    ).toBeTruthy()
    expect(reattachParams.room_session.name).toBe(roomName)
    expect(reattachParams.room.name).toBe(roomName)



    // --------------- Leaving the room ---------------
    await page.evaluate(() => {
      // @ts-expect-error
      return window._roomObj.leave()
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