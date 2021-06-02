import { SignalWire, ClientEvents, connect } from '@signalwire/core'
import { Call } from '@signalwire/webrtc'
import { videoElementFactory } from './utils/videoElementFactory'

export class Client<EventType extends string = ClientEvents> extends SignalWire<EventType> {
  get rooms() {
    return {
      // TODO: use CallOptions interface here
      makeCall: (options: any) => {
        const call = connect({
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
          call.on('layout.changed', (params: any) => {
            layoutChangedHandler({
              layout: params.layout,
              // @ts-ignore
              localVideoTrack: call.localVideoTrack,
              // @ts-ignore
              myMemberId: call.memberId,
            })
          })
          call.on('layout.changed', (params: any) => {
            // @ts-ignore
            layoutChangedHandler(params, call.memberId)
          })
          call.on('track', rtcTrackHandler)
          call.on('destroy', destroyHandler)
        }

        return call
      },
    }
  }
}