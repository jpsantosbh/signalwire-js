import { logger } from '@signalwire/core'
import * as WebRTC from './webrtcHelpers'
import { assureDeviceId } from './deviceHelpers'
import { DeviceType } from './constants'
import {
  CallOptions,
  IVertoCanvasInfo,
  ICanvasInfo,
  ICanvasLayout,
  IConferenceInfo,
  ILayout,
  IVertoLayout,
} from './interfaces'

export const getUserMedia = async (
  constraints: MediaStreamConstraints
): Promise<MediaStream | null> => {
  logger.info('RTCService.getUserMedia', constraints)
  const { audio, video } = constraints
  if (!audio && !video) {
    return null
  }
  try {
    return await WebRTC.getUserMedia(constraints)
  } catch (error) {
    logger.error('getUserMedia error: ', error)
    throw error
  }
}

export const removeUnsupportedConstraints = (
  constraints: MediaTrackConstraints
): void => {
  const supported = WebRTC.getSupportedConstraints()
  Object.keys(constraints).map((key) => {
    if (
      !supported.hasOwnProperty(key) ||
      // @ts-ignore
      constraints[key] === null ||
      // @ts-ignore
      constraints[key] === undefined
    ) {
      // @ts-ignore
      delete constraints[key]
    }
  })
}

export const getMediaConstraints = async (
  options: CallOptions
): Promise<MediaStreamConstraints> => {
  let { audio = true, micId } = options
  const { micLabel = '' } = options
  if (micId) {
    const newMicId = await assureDeviceId(
      micId,
      micLabel,
      DeviceType.AudioIn
    ).catch((_error) => null)
    if (newMicId) {
      if (typeof audio === 'boolean') {
        audio = {}
      }
      audio.deviceId = { exact: newMicId }
    }
  }

  let { video = false, camId } = options
  const { camLabel = '' } = options
  if (camId) {
    const newCamId = await assureDeviceId(
      camId,
      camLabel,
      DeviceType.Video
    ).catch((_error) => null)
    if (newCamId) {
      if (typeof video === 'boolean') {
        video = {}
      }
      video.deviceId = { exact: newCamId }
    }
  }

  return { audio, video }
}

type DestructuredResult = {
  subscribed: string[]
  alreadySubscribed: string[]
  unauthorized: string[]
  unsubscribed: string[]
  notSubscribed: string[]
}

export const destructSubscribeResponse = (
  response: any
): DestructuredResult => {
  const tmp: any = {
    subscribed: [],
    alreadySubscribed: [],
    unauthorized: [],
    unsubscribed: [],
    notSubscribed: [],
  }
  Object.keys(tmp).forEach((k) => {
    tmp[k] = response[`${k}Channels`] || []
  })
  return tmp
}

const _updateMediaStreamTracks = (
  stream: MediaStream,
  kind?: string,
  enabled?: boolean
) => {
  if (!WebRTC.streamIsValid(stream)) {
    return null
  }
  const _updateTrack = (track: MediaStreamTrack) => {
    switch (enabled) {
      case true:
        track.enabled = true
        break
      case false:
        track.enabled = false
        break
      default:
        track.enabled = !track.enabled
        break
    }
  }
  switch (kind) {
    case 'audio':
      return stream.getAudioTracks().forEach(_updateTrack)
    case 'video':
      return stream.getVideoTracks().forEach(_updateTrack)
    default:
      return stream.getTracks().forEach(_updateTrack)
  }
}

export const enableAudioTracks = (stream: MediaStream) =>
  _updateMediaStreamTracks(stream, 'audio', true)
export const disableAudioTracks = (stream: MediaStream) =>
  _updateMediaStreamTracks(stream, 'audio', false)
export const toggleAudioTracks = (stream: MediaStream) =>
  _updateMediaStreamTracks(stream, 'audio')
export const enableVideoTracks = (stream: MediaStream) =>
  _updateMediaStreamTracks(stream, 'video', true)
export const disableVideoTracks = (stream: MediaStream) =>
  _updateMediaStreamTracks(stream, 'video', false)
export const toggleVideoTracks = (stream: MediaStream) =>
  _updateMediaStreamTracks(stream, 'video')

const roundToFixed = (value: number, num = 2) => {
  return Number(value.toFixed(num))
}

export const mutateCanvasInfoData = (
  canvasInfo: IVertoCanvasInfo
): ICanvasInfo => {
  const { canvasID, layoutFloorID, scale, canvasLayouts, ...rest } = canvasInfo
  const layouts: ICanvasLayout[] = []
  let layoutOverlap = false
  for (let i = 0; i < canvasLayouts.length; i++) {
    const layout = canvasLayouts[i]
    const { memberID = 0, audioPOS, xPOS, yPOS, ...rest } = layout
    layoutOverlap =
      layoutOverlap || Boolean(layout.overlap === 1 && layout.layerOccupied)
    layouts.push({
      startX: `${roundToFixed((layout.x / scale) * 100)}%`,
      startY: `${roundToFixed((layout.y / scale) * 100)}%`,
      percentageWidth: `${roundToFixed((layout.scale / scale) * 100)}%`,
      percentageHeight: `${roundToFixed((layout.hscale / scale) * 100)}%`,
      participantId: String(memberID),
      audioPos: audioPOS,
      xPos: xPOS,
      yPos: yPOS,
      ...rest,
    })
  }
  return {
    ...rest,
    canvasId: canvasID,
    layoutFloorId: layoutFloorID,
    scale,
    canvasLayouts: layouts,
    layoutOverlap,
  }
}

export const checkIsDirectCall = ({ variables }: { [key: string]: any }) => {
  return typeof variables === 'object' && 'verto_svar_direct_call' in variables
}

export const destructConferenceState = (confState: any): IConferenceInfo => {
  const { variables = {}, flags = {} } = confState
  const suffix = `${confState.md5}@${confState.domain}`
  const confName = confState.displayName || confState.name
  return {
    uuid: variables.conference_uuid || confState.uuid,
    md5: confState.md5,
    domain: confState.domain,
    running: Boolean(confState.running),
    laChannel: `conference-liveArray.${suffix}`,
    infoChannel: `conference-info.${suffix}`,
    modChannel: `conference-mod.${suffix}`,
    chatChannel: `conference-chat.${suffix}`,
    confName,
    numMembers: Number(confState.members) || 0,
    isPrivate: variables.is_private === 'true',
    mohPlaying: Boolean(confState.mohPlaying),
    filesPlaying: Boolean(confState.filesPlaying),
    filesRole: confState.filesRole || null,
    filesPlayingName: confState.filesPlayingName || null,
    filesPlayingVolume: Number(confState.filesPlayingVolume) || 0,
    filesPlayingPaused: Boolean(confState.filesPlayingPaused),
    filesSeekable: Boolean(confState.filesSeekable),
    asyncFilesPlaying: Boolean(confState.asyncFilesPlaying),
    asyncFilesRole: confState.asyncFilesRole || null,
    asyncFilesPlayingName: confState.asyncFilesPlayingName || null,
    asyncFilesPlayingVolume: Number(confState.asyncFilesPlayingVolume) || 0,
    asyncFilesPlayingPaused: Boolean(confState.asyncFilesPlayingPaused),
    asyncFilesSeekable: Boolean(confState.asyncFilesSeekable),
    performerDelay: confState.performerDelay,
    volAudience: confState['vol-audience'],
    filesFullScreen: Boolean(confState.filesFullScreen),
    vidFloorRole: confState.vidFloorRole || null,
    motionQuality: confState.motionQuality || 1,
    motionQualityInbound: confState.motionQualityIn || 1,
    videoShuffle: confState.videoShuffle || 0,
    zones: confState.zones || [],
    // flags
    silentMode: flags['silent-mode'] || false,
    blindMode: flags['blind-mode'] || false,
    meetingMode: flags['meeting-mode'] || false,
    vidMuteHide: flags['vid-mute-hide'] || false,
    personalCanvas: Boolean(flags.personalCanvas),
    personalCanvasTP: flags.personalCanvasTP || null,
    locked: Boolean(flags.locked),
    recording: Boolean(flags.recording),
    liveMusic: Boolean(flags.liveMusic),
    logosVisible: Boolean(flags['logos-visible']),
    handraiseOnscreen: Boolean(flags['handraise-onscreen']),
    // variables
    publicClipeeze: variables.public_clipeeze === 'true',
    confQuality: variables.conf_quality,
    accessPin: variables.access_pin || null,
    moderatorPin: variables.moderator_pin || null,
    speakerHighlight: variables.speaker_highlight === 'true',
    disableIntercom: variables.disable_intercom === true,
    lastSnapshot: variables.lastSnapshot,
    lastLayoutGroup: variables.lastLayoutGroup,
    lastLayout: variables.lastLayout,
    userRecordFile: variables.user_record_file || null,
    podcastMode: variables.podcast_mode === 'true',
  }
}

const _layoutReducer = (result: ILayout[], layout: IVertoLayout) => {
  const { type, name, displayName, resIDS = [] } = layout
  const label = displayName || name.replace(/[-_]/g, ' ')
  return result.concat({
    id: name,
    label,
    type,
    reservationIds: resIDS,
    belongsToAGroup: false,
  })
}

function _layoutCompare(prev: ILayout, next: ILayout) {
  const prevLabel = prev.label.toLowerCase()
  const nextLabel = next.label.toLowerCase()
  if (prevLabel > nextLabel) {
    return 1
  } else if (prevLabel < nextLabel) {
    return -1
  }
  return 0
}

export const mungeLayoutList = (
  layouts: IVertoLayout[],
  layoutGroups: IVertoLayout[]
) => {
  const layoutsPartOfGroup = layoutGroups.reduce((cumulative, layout) => {
    // @ts-ignore
    return cumulative.concat(layout.groupLayouts || [])
  }, [])

  const normalList = layouts.reduce(_layoutReducer, [])
  normalList.forEach((layout) => {
    // @ts-ignore
    layout.belongsToAGroup = layoutsPartOfGroup.includes(layout.id)
  })
  const groupList = layoutGroups.reduce(_layoutReducer, [])
  return groupList.concat(normalList).sort(_layoutCompare)
}