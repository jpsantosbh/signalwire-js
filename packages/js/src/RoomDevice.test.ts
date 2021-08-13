import { RoomDevice } from './RoomDevice'
import { configureJestStore } from './testUtils'

describe('RoomDevice Object', () => {
  let roomDevice: RoomDevice

  beforeEach(() => {
    roomDevice = new RoomDevice({
      store: configureJestStore(),
      emitter: jest.fn() as any,
    })
    roomDevice.execute = jest.fn()
  })

  it('should have all the custom methods defined', () => {
    expect(roomDevice.audioMute).toBeDefined()
    expect(roomDevice.audioUnmute).toBeDefined()
    expect(roomDevice.videoMute).toBeDefined()
    expect(roomDevice.videoUnmute).toBeDefined()
    expect(roomDevice.setMicrophoneVolume).toBeDefined()
    expect(roomDevice.setInputSensitivity).toBeDefined()
  })
})