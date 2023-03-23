import type { SagaIterator } from '@redux-saga/types';
import { EventChannel } from '@redux-saga/core';
import { SessionConstructor, InternalUserOptions, InternalChannels } from '../utils/interfaces';
import { BaseSession } from '../BaseSession';
import { PubSubChannel } from './interfaces';
interface StartSagaOptions {
    session: BaseSession;
    sessionChannel: EventChannel<any>;
    pubSubChannel: PubSubChannel;
    userOptions: InternalUserOptions;
}
export declare function initSessionSaga({ SessionConstructor, userOptions, channels, }: {
    SessionConstructor: SessionConstructor;
    userOptions: InternalUserOptions;
    channels: InternalChannels;
}): SagaIterator;
export declare function reauthenticateWorker({ session, token, pubSubChannel, }: {
    session: BaseSession;
    token: string;
    pubSubChannel: PubSubChannel;
}): Generator<import("@redux-saga/core/effects").ChannelPutEffect<import("./interfaces").MapToPubSubShape<import("..").InternalVideoRoomJoinedEvent> | import("./interfaces").MapToPubSubShape<import("..").InternalVideoRoomAudienceCountEvent> | import("./interfaces").MapToPubSubShape<import("..").InternalVideoMemberUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").InternalVideoMemberTalkingEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRoomStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRoomSubscribedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRoomUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRoomEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoMemberJoinedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoMemberLeftEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoMemberUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoMemberTalkingEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoMemberPromotedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoMemberDemotedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoLayoutChangedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRecordingStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRecordingUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRecordingEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoPlaybackStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoPlaybackUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoPlaybackEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoStreamStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoStreamEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoRoomAudienceCountEvent> | {
    type: "session.unknown" | "session.idle" | "session.reconnecting" | "session.connected" | "session.disconnected" | "session.auth_error" | "session.expiring";
    payload: Error | undefined;
} | import("./interfaces").MapToPubSubShape<import("..").VideoManagerRoomsSubscribedEvent> | import("./interfaces").MapToPubSubShape<import("..").VideoManagerRoomEvent> | import("./interfaces").MapToPubSubShape<import("..").ChatChannelMessageEvent> | import("./interfaces").MapToPubSubShape<import("..").ChatMemberJoinedEvent> | import("./interfaces").MapToPubSubShape<import("..").ChatMemberUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").ChatMemberLeftEvent> | import("./interfaces").MapToPubSubShape<import("..").PubSubChannelMessageEvent> | import("..").TaskAction | import("./interfaces").MapToPubSubShape<import("..").MessagingStateEvent> | import("./interfaces").MapToPubSubShape<import("..").MessageUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").MessagingReceiveEvent> | import("./interfaces").MapToPubSubShape<import("..").MessageReceivedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallDialEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallStateEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallReceiveEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallPlayEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallRecordEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallCollectEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallTapEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallConnectEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallSendDigitsEvent> | import("./interfaces").MapToPubSubShape<import("..").CallingCallDetectEvent> | import("./interfaces").MapToPubSubShape<import("..").CallReceivedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPlaybackStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPlaybackUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPlaybackEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPlaybackFailedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallRecordingStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallRecordingUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallRecordingEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallRecordingFailedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPromptStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPromptStartOfInputEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPromptUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPromptEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallPromptFailedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallTapStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallTapEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallConnectConnectingEvent> | import("./interfaces").MapToPubSubShape<import("..").CallConnectConnectedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallConnectDisconnectedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallConnectFailedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallDetectStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallDetectUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallDetectEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallCollectStartedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallCollectStartOfInputEvent> | import("./interfaces").MapToPubSubShape<import("..").CallCollectUpdatedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallCollectEndedEvent> | import("./interfaces").MapToPubSubShape<import("..").CallCollectFailedEvent>> | import("@redux-saga/core/effects").CallEffect<void> | import("@redux-saga/core/effects").PutEffect<{
    payload: import("../utils/interfaces").RPCConnectResult;
    type: string;
}>, void, unknown>;
export declare function sessionStatusWatcher(options: StartSagaOptions): SagaIterator;
interface SessionAuthErrorOptions extends StartSagaOptions {
    action: any;
}
export declare function sessionAuthErrorSaga(options: SessionAuthErrorOptions): SagaIterator;
interface RootSagaOptions {
    SessionConstructor: SessionConstructor;
}
declare const _default: (options: RootSagaOptions) => ({ userOptions, channels, }: {
    userOptions: InternalUserOptions;
    channels: InternalChannels;
}) => SagaIterator<any>;
export default _default;
//# sourceMappingURL=rootSaga.d.ts.map