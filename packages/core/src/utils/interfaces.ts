import { Store } from 'redux'
import type { EventEmitter } from '../utils/EventEmitter'
import { Session } from '../Session'

/**
 * Minimal interface that the emitter needs to fulfill
 */
export type Emitter = Pick<
  EventEmitter,
  'on' | 'off' | 'once' | 'emit' | 'removeAllListeners'
>

type JSONRPCParams = {
  [key: string]: any
}

type JSONRPCResult = {
  [key: string]: any
}

type JSONRPCError = {
  [key: string]: any
}

export interface JSONRPCRequest {
  jsonrpc: '2.0'
  id: string
  method: string
  params?: JSONRPCParams
}

export interface JSONRPCResponse {
  jsonrpc: '2.0'
  id: string
  result?: JSONRPCResult
  error?: JSONRPCError
}

export interface SessionOptions {
  host?: string
  project?: string
  token: string
  autoConnect?: boolean
}

export interface UserOptions extends SessionOptions {
  devTools?: boolean
  emitter?: Emitter
}

export interface BaseClientOptions extends UserOptions {
  emitter: Emitter
}

export interface BaseComponentOptions {
  store: Store
  emitter: Emitter
}

export interface SessionRequestObject {
  rpcRequest: JSONRPCRequest
  resolve: (value: unknown) => void
  reject: (value: unknown) => void
}

export interface SessionRequestQueued {
  resolve: (value: unknown) => void
  msg: JSONRPCRequest | JSONRPCResponse
}

export interface IBladeAuthorization {
  type: 'video'
  project: string
  scopes: string[]
  scope_id: string
  resource: string
  user_name: string
  room?: {
    name: string
    scopes: string[]
  }
  signature: string
  expires_at?: number
}

export interface IBladeConnectResult {
  session_restored: boolean
  sessionid: string
  nodeid: string
  identity: string
  master_nodeid: string
  authorization: IBladeAuthorization
  result?: {
    protocol: string
    iceServers?: RTCIceServer[]
  }
}

export type SessionConstructor = typeof Session

export type SessionAuthStatus =
  | 'unknown'
  | 'authorizing'
  | 'authorized'
  | 'unauthorized'

// TODO: define proper list of statuses
export type SessionStatus =
  | 'unknown'
  | 'reconnecting'
  | 'connected'
  | 'disconnected'

export type SessionEvents = `session.${SessionStatus}`

/**
 * List of all the events the client can listen to.
 */
export type ClientEvents = Record<SessionEvents, () => void>

type LayoutEvent = 'changed'

// prettier-ignore
type RoomEvent =
  | 'ended'
  | 'started'
  | 'subscribed'
  | 'updated'

// prettier-ignore
type RoomMemberEvent =
  | 'joined'
  | 'left'
  | 'updated'
  | `updated.${keyof RoomMember}`

type CallState =
  | 'active'
  | 'answering'
  | 'destroy'
  | 'early'
  | 'hangup'
  | 'held'
  | 'new'
  | 'purge'
  | 'recovering'
  | 'requesting'
  | 'ringing'
  | 'track'
  | 'trying'

type LayoutEvents = `layout.${LayoutEvent}`
type MemberEvents = `member.${RoomMemberEvent}`
type RoomEvents = `room.${RoomEvent}`
/**
 * List of all the events the call can listen to
 */
export type CallEventNames =
  | LayoutEvents
  | MemberEvents
  | RoomEvents
  | CallState

// TODO: replace all `params:any` with proper types
type EventsHandlerMapping = Record<LayoutEvents, (params: any) => void> &
  Record<MemberEvents, (params: any) => void> &
  Record<RoomEvents, (params: any) => void> &
  Record<CallState, (params: any) => void>

export type CallEvents = {
  [k in CallEventNames]: EventsHandlerMapping[k]
}

export type SessionAuthError = {
  code: number
  error: string
}

export interface RoomLayout {
  id: string
  name?: string
}

export interface RoomMemberLocation {
  y: number
  x: number
  layer_index: number
  z_index: number
  height: number
  width: number
}

export interface RoomMember {
  id: string
  room_session_id: string
  room_id: string
  type: 'member'
  visible: boolean
  audio_muted: boolean
  video_muted: boolean
  name: string
  location: RoomMemberLocation
}

export interface Room {
  room_id: string
  room_session_id: string
  name: string
  members: RoomMember[]
  locked: boolean
  layouts: RoomLayout[]
}

interface RoomSubscribedEvent {
  event_type: 'room.subscribed'
  params: {
    room: Room
    call_id: string
    member_id: string
  }
  // TODO: check with backend why timestamp string
  timestamp: string
  event_channel: string
}

interface MemberUpdated {
  event_type: 'member.updated'
  params: {
    member: RoomMember & {
      updated: (keyof RoomMember)[]
    }
    call_id: string
    member_id: string
  }
  // TODO: check with backend why timestamp string
  timestamp: string
  event_channel: string
}

// prettier-ignore
export type ConferenceWorkerParams =
  | RoomSubscribedEvent
  | MemberUpdated

interface ConferenceEvent {
  broadcaster_nodeid: string
  protocol: string
  channel: 'notifications'
  event: 'conference'
  params: ConferenceWorkerParams
}

interface VertoEvent {
  broadcaster_nodeid: string
  protocol: string
  channel: 'notifications'
  event: 'queuing.relay.events'
  params: {
    event_type: 'webrtc.message'
    event_channel: string
    timestamp: number
    project_id: string
    node_id: string
    params: JSONRPCRequest
  }
}

interface TaskEvent {
  broadcaster_nodeid: string
  protocol: string
  channel: 'notifications'
  event: 'queuing.relay.tasks'
  params: Record<string, any>
}

interface MessagingEvent {
  broadcaster_nodeid: string
  protocol: string
  channel: 'notifications'
  event: 'queuing.relay.messaging'
  params: Record<string, any>
}

// prettier-ignore
export type BladeBroadcastParams =
  | ConferenceEvent
  | VertoEvent
  | TaskEvent
  | MessagingEvent

/**
 * List of all room member methods
 */
type RoomMemberMethod =
  | 'member.audio_mute'
  | 'member.audio_unmute'
  | 'member.video_mute'
  | 'member.video_unmute'
  | 'member.deaf'
  | 'member.undeaf'
  | 'member.set_input_volume'
  | 'member.set_output_volume'
  | 'member.set_input_sensitivity'
  | 'member.remove'

/**
 * List of all room layout methods
 */
// prettier-ignore
type RoomLayoutMethod =
  | 'layout.set'

/**
 * List of all room member methods
 */
export type RoomMethod =
  | 'video.list_available_layouts'
  | 'video.hide_video_muted'
  | 'video.show_video_muted'
  | `video.${RoomMemberMethod}`
  | `video.${RoomLayoutMethod}`

/**
 * List of all available blade.execute methods
 */
// prettier-ignore
export type BladeExecuteMethod =
  | RoomMethod
  | 'video.message'
