import { channel, eventChannel } from 'redux-saga'
import { expectSaga } from 'redux-saga-test-plan'
import { socketClosedWorker } from './rootSaga'
import { sessionActions } from './features'
import { sessionDisconnected } from './actions'

describe('socketClosedWorker', () => {
  it('should try to reconnect when code >= 1006 && code <= 1014', async () => {
    const session = {
      closed: true,
      connect: jest.fn(),
    } as any
    const timeout = 3000
    const pubSubChannel = channel()
    const sessionChannel = eventChannel(() => () => {})

    return expectSaga(socketClosedWorker, {
      session,
      pubSubChannel,
      sessionChannel,
      payload: { code: 1006, reason: '' },
    })
      .put(sessionActions.statusChange('reconnecting'))
      .call(session.connect)
      .run(timeout)
  })

  it('should close the session when the code is outside the range we handle for reconnecting', async () => {
    const session = {
      closed: true,
      connect: jest.fn(),
    } as any
    const pubSubChannel = channel()
    const sessionChannel = eventChannel(() => () => {})

    return Promise.all([
      expectSaga(socketClosedWorker, {
        session,
        pubSubChannel,
        sessionChannel,
        payload: { code: 1002, reason: '' },
      })
        .put(sessionActions.statusChange('disconnected'))
        .put(pubSubChannel, sessionDisconnected())
        .run(),
      expectSaga(socketClosedWorker, {
        session,
        pubSubChannel,
        sessionChannel,
        payload: { code: 1000, reason: '' },
      })
        .put(sessionActions.statusChange('disconnected'))
        .put(pubSubChannel, sessionDisconnected())
        .run(),
      expectSaga(socketClosedWorker, {
        session,
        pubSubChannel,
        sessionChannel,
        payload: { code: 1020, reason: '' },
      })
        .put(sessionActions.statusChange('disconnected'))
        .put(pubSubChannel, sessionDisconnected())
        .run(),
    ])
  })
})