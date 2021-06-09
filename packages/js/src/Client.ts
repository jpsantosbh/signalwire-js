import { connect, SignalWire } from '@signalwire/core'
import { Call, CallEvents, CallOptions } from '@signalwire/webrtc'
import StrictEventEmitter from 'strict-event-emitter-types'
import { videoElementFactory } from './utils/videoElementFactory'

interface MakeCallOptions extends CallOptions {
  rootElementId?: string
  applyLocalVideoOverlay?: boolean
}

export class Client extends SignalWire {
  get rooms() {
    return {
      makeCall: (options: MakeCallOptions) => {
        const call: StrictEventEmitter<Call, CallEvents> = connect({
          store: this.store,
          Component: Call,
          onStateChangeListeners: {
            state: 'onStateChange',
            remoteSDP: 'onRemoteSDP',
            roomId: 'onRoomId',
            errors: 'onError',
            responses: 'onSuccess',
          },
        })({
          ...options,
          emitter: this.options.emitter,
        })

        const { rootElementId, applyLocalVideoOverlay } = options
        if (rootElementId) {
          const {
            rtcTrackHandler,
            destroyHandler,
            layoutChangedHandler,
          } = videoElementFactory({ rootElementId, applyLocalVideoOverlay })
          call.on('layout.changed', (params) => {
            layoutChangedHandler({
              layout: params.layout,
              localVideoTrack: call.localVideoTrack,
              myMemberId: call.memberId,
            })
          })
          call.on('track', rtcTrackHandler)
          call.on('destroy', destroyHandler)
        }

        return call
      },
    }
  }
}