import {
  JWTSession,
  configureStore,
  UserOptions,
  BaseClientOptions,
  getEventEmitter,
} from '@signalwire/core'
import { Client } from './Client'

type ClientEvents = 'session.connected' | 'session.disconnected'

export const createClient = async (userOptions: UserOptions) => {
  const baseUserOptions: BaseClientOptions<
    ClientEvents,
    Client<ClientEvents>
  > = {
    ...userOptions,
    emitter: getEventEmitter(userOptions),
  }
  const store = configureStore({
    userOptions: baseUserOptions,
    SessionConstructor: JWTSession,
  })
  const client = new Client(baseUserOptions, store)
  if (baseUserOptions.autoConnect) {
    await client.connect()
  }
  return client
}
