import type { SwEvent } from '.';
import type { CamelToSnakeCase, EntityUpdated, ToInternalVideoEvent, MemberCommandParams, MemberCommandWithValueParams, MemberCommandWithVolumeParams, OnlyFunctionProperties, OnlyStateProperties } from './utils';
import type { InternalVideoMemberEntity } from './videoMember';
import * as Rooms from '../rooms';
/**
 * Public event types
 */
export declare type RoomStarted = 'room.started';
export declare type RoomSubscribed = 'room.subscribed';
export declare type RoomUpdated = 'room.updated';
export declare type RoomEnded = 'room.ended';
export declare type InternalRoomAudienceCount = 'room.audience_count';
export declare type RoomJoined = 'room.joined';
export declare type RoomLeft = 'room.left';
export declare type RoomAudienceCount = 'room.audienceCount';
export declare type VideoRoomAudienceCountEventNames = ToInternalVideoEvent<InternalRoomAudienceCount | RoomAudienceCount>;
/**
 * List of public event names
 */
export declare type VideoRoomSessionEventNames = RoomStarted | RoomSubscribed | RoomUpdated | RoomEnded | RoomJoined | RoomLeft;
/**
 * List of internal events
 * @internal
 */
export declare type InternalVideoRoomSessionEventNames = ToInternalVideoEvent<VideoRoomSessionEventNames>;
/**
 * Public Contract for a VideoRoomSession
 */
export interface VideoRoomSessionContract {
    /** Unique id for this room session */
    id: string;
    /** Display name for this room. Defaults to the value of `name` */
    displayName: string;
    /** Id of the room associated to this room session */
    roomId: string;
    /** @internal */
    eventChannel: string;
    /** Name of this room */
    name: string;
    /** Whether recording is active */
    recording: boolean;
    /**
     * List of active recordings in the room
     * @deprecated Use {@link getRecordings}
     **/
    recordings?: any[];
    /** Whether muted videos are shown in the room layout. See {@link setHideVideoMuted} */
    hideVideoMuted: boolean;
    /** URL to the room preview. */
    previewUrl?: string;
    /** Current layout name used in the room. */
    layoutName: string;
    /** Metadata associated to this room session. */
    meta?: Record<string, unknown>;
    /**
     * List of members that are part of this room session
     * @deprecated Use {@link getMembers}
     **/
    members?: InternalVideoMemberEntity[];
    /** Fields that have changed in this room session */
    updated?: Array<Exclude<keyof VideoRoomSessionContract, 'updated'>>;
    /** Whether the room is streaming */
    streaming: boolean;
    /** List of active streams in the room session. */
    streams?: Rooms.RoomSessionStream[];
    /**
     * Puts the microphone on mute. The other participants will not hear audio
     * from the muted participant anymore. You can use this method to mute
     * either yourself or another participant in the room.
     * @param params
     * @param params.memberId id of the member to mute. If omitted, mutes the
     * default device in the local client.
     *
     * @permissions
     *  - `room.self.audio_mute`: to mute a local device
     *  - `room.member.audio_mute`: to mute a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Muting your own microphone:
     * ```typescript
     * await room.audioMute()
     * ```
     *
     * @example Muting the microphone of another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.audioMute({memberId: id})
     * ```
     */
    audioMute(params?: MemberCommandParams): Rooms.AudioMuteMember;
    /**
     * Unmutes the microphone if it had been previously muted. You can use this
     * method to unmute either yourself or another participant in the room.
     * @param params
     * @param params.memberId id of the member to unmute. If omitted, unmutes
     * the default device in the local client.
     *
     * @permissions
     *  - `room.self.audio_unmute`: to unmute a local device
     *  - `room.member.audio_unmute`: to unmute a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Unmuting your own microphone:
     * ```typescript
     * await room.audioUnmute()
     * ```
     *
     * @example Unmuting the microphone of another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.audioUnmute({memberId: id})
     * ```
     */
    audioUnmute(params?: MemberCommandParams): Rooms.AudioUnmuteMember;
    /**
     * Puts the video on mute. Participants will see a mute image instead of the
     * video stream. You can use this method to mute either yourself or another
     * participant in the room.
     * @param params
     * @param params.memberId id of the member to mute. If omitted, mutes the
     * default device in the local client.
     *
     * @permissions
     *  - `room.self.video_mute`: to unmute a local device
     *  - `room.member.video_mute`: to unmute a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Muting your own video:
     * ```typescript
     * await room.videoMute()
     * ```
     *
     * @example Muting the video of another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.videoMute({memberId: id})
     * ```
     */
    videoMute(params?: MemberCommandParams): Rooms.VideoMuteMember;
    /**
     * Unmutes the video if it had been previously muted. Participants will
     * start seeing the video stream again. You can use this method to unmute
     * either yourself or another participant in the room.
     * @param params
     * @param params.memberId id of the member to unmute. If omitted, unmutes
     * the default device in the local client.
     *
     * @permissions
     *  - `room.self.video_mute`: to unmute a local device
     *  - `room.member.video_mute`: to unmute a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Unmuting your own video:
     * ```typescript
     * await room.videoUnmute()
     * ```
     *
     * @example Unmuting the video of another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.videoUnmute({memberId: id})
     * ```
     */
    videoUnmute(params?: MemberCommandParams): Rooms.VideoUnmuteMember;
    /** @deprecated Use {@link setInputVolume} instead. */
    setMicrophoneVolume(params: MemberCommandWithVolumeParams): Rooms.SetInputVolumeMember;
    /**
     * Sets the input volume level (e.g. for the microphone). You can use this
     * method to set the input volume for either yourself or another participant
     * in the room.
     *
     * @param params
     * @param params.memberId id of the member for which to set input volume. If
     * omitted, sets the volume of the default device in the local client.
     * @param params.volume desired volume. Values range from -50 to 50, with a
     * default of 0.
     *
     * @permissions
     *  - `room.self.set_input_volume`: to set the volume for a local device
     *  - `room.member.set_input_volume`: to set the volume for a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Setting your own microphone volume:
     * ```typescript
     * await room.setInputVolume({volume: -10})
     * ```
     *
     * @example Setting the microphone volume of another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.setInputVolume({memberId: id, volume: -10})
     * ```
     */
    setInputVolume(params: MemberCommandWithVolumeParams): Rooms.SetInputVolumeMember;
    /**
     * Sets the input level at which the participant is identified as currently
     * speaking. You can use this method to set the input sensitivity for either
     * yourself or another participant in the room.
     * @param params
     * @param params.memberId id of the member to affect. If omitted, affects
     * the default device in the local client.
     * @param params.value desired sensitivity. The default value is 30 and the
     * scale goes from 0 (lowest sensitivity, essentially muted) to 100 (highest
     * sensitivity).
     *
     * @permissions
     *  - `room.self.set_input_sensitivity`: to set the sensitivity for a local
     *    device
     *  - `room.member.set_input_sensitivity`: to set the sensitivity for a
     *    remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Setting your own input sensitivity:
     * ```typescript
     * await room.setInputSensitivity({value: 80})
     * ```
     *
     * @example Setting the input sensitivity of another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.setInputSensitivity({memberId: id, value: 80})
     * ```
     */
    setInputSensitivity(params: MemberCommandWithValueParams): Rooms.SetInputSensitivityMember;
    /**
     * Returns a list of members currently in the room.
     *
     * @example
     * ```typescript
     * await room.getMembers()
     * ```
     */
    getMembers(): Rooms.GetMembers;
    /**
     * Mutes the incoming audio. The affected participant will not hear audio
     * from the other participants anymore. You can use this method to make deaf
     * either yourself or another participant in the room.
     *
     * Note that in addition to making a participant deaf, this will also
     * automatically mute the microphone of the target participant (even if
     * there is no `audio_mute` permission). If you want, you can then manually
     * unmute it by calling {@link audioUnmute}.
     * @param params
     * @param params.memberId id of the member to affect. If omitted, affects
     * the default device in the local client.
     *
     * @permissions
     *  - `room.self.deaf`: to make yourself deaf
     *  - `room.member.deaf`: to make deaf a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Making yourself deaf:
     * ```typescript
     * await room.deaf()
     * ```
     *
     * @example Making another participant deaf:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.deaf({memberId: id})
     * ```
     */
    deaf(params?: MemberCommandParams): Rooms.DeafMember;
    /**
     * Unmutes the incoming audio. The affected participant will start hearing
     * audio from the other participants again. You can use this method to
     * undeaf either yourself or another participant in the room.
     *
     * Note that in addition to allowing a participants to hear the others, this
     * will also automatically unmute the microphone of the target participant
     * (even if there is no `audio_unmute` permission). If you want, you can then
     * manually mute it by calling {@link audioMute}.
     * @param params
     * @param params.memberId id of the member to affect. If omitted, affects
     * the default device in the local client.
     *
     * @permissions
     *  - `room.self.deaf`: to make yourself deaf
     *  - `room.member.deaf`: to make deaf a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Undeaf yourself:
     * ```typescript
     * await room.undeaf()
     * ```
     *
     * @example Undeaf another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.undeaf({memberId: id})
     * ```
     */
    undeaf(params?: MemberCommandParams): Rooms.UndeafMember;
    /** @deprecated Use {@link setOutputVolume} instead. */
    setSpeakerVolume(params: MemberCommandWithVolumeParams): Rooms.SetOutputVolumeMember;
    /**
     * Sets the output volume level (e.g., for the speaker). You can use this
     * method to set the output volume for either yourself or another participant
     * in the room.
     * @param params
     * @param params.memberId id of the member to affect. If omitted, affects the
     * default device in the local client.
     * @param params.volume desired volume. Values range from -50 to 50, with a
     * default of 0.
     *
     * @permissions
     *  - `room.self.set_output_volume`: to set the speaker volume for yourself
     *  - `room.member.set_output_volume`: to set the speaker volume for a remote
     *    member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Setting your own output volume:
     * ```typescript
     * await room.setOutputVolume({volume: -10})
     * ```
     *
     * @example Setting the output volume of another participant:
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.setOutputVolume({memberId: id, volume: -10})
     * ```
     */
    setOutputVolume(params: MemberCommandWithVolumeParams): Rooms.SetOutputVolumeMember;
    /**
     * Removes a specific participant from the room.
     * @param params
     * @param params.memberId id of the member to remove
     *
     * @permissions
     *  - `room.member.remove`: to remove a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * const id = 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     * await room.removeMember({memberId: id})
     * ```
     */
    removeMember(params: Required<MemberCommandParams>): Rooms.RemoveMember;
    /**
     * Removes all the participants from the room.
     *
     * @permissions
     *  - `room.member.remove`: to remove a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * await room.removeAllMembers()
     * ```
     */
    removeAllMembers(): Rooms.RemoveAllMembers;
    /**
     * Show or hide muted videos in the room layout. Members that have been muted
     * via {@link videoMute} will display a mute image instead of the video, if
     * this setting is enabled.
     *
     * @param value whether to show muted videos in the room layout.
     *
     * @permissions
     *  - `room.hide_video_muted`
     *  - `room.show_video_muted`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * await roomSession.setHideVideoMuted(false)
     * ```
     */
    setHideVideoMuted(value: boolean): Rooms.SetHideVideoMuted;
    /**
     * Returns a list of available layouts for the room. To set a room layout,
     * use {@link setLayout}.
     *
     * @permissions
     *  - `room.list_available_layouts`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * await room.getLayouts()
     * ```
     */
    getLayouts(): Rooms.GetLayouts;
    /**
     * Sets a layout for the room. You can obtain a list of available layouts
     * with {@link getLayouts}.
     *
     * @permissions
     *  - `room.set_layout`
     *  - `room.set_position` (if you need to assign positions)
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example Set the 6x6 layout:
     * ```typescript
     * await room.setLayout({name: "6x6"})
     * ```
     */
    setLayout(params: Rooms.SetLayoutParams): Rooms.SetLayout;
    /**
     * Assigns a position in the layout for multiple members.
     *
     * @permissions
     *  - `room.set_position`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```js
     * await roomSession.setPositions({
     *   positions: {
     *     "1bf4d4fb-a3e4-4d46-80a8-3ebfdceb2a60": "reserved-1",
     *     "e0c5be44-d6c7-438f-8cda-f859a1a0b1e7": "auto"
     *   }
     * })
     * ```
     */
    setPositions(params: Rooms.SetPositionsParams): Rooms.SetPositions;
    /**
     * Assigns a position in the layout to the specified member.
     *
     * @permissions
     *  - `room.self.set_position`: to set the position for the local member
     *  - `room.member.set_position`: to set the position for a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```js
     * await roomSession.setMemberPosition({
     *   memberId: "1bf4d4fb-a3e4-4d46-80a8-3ebfdceb2a60",
     *   position: "off-canvas"
     * })
     * ```
     */
    setMemberPosition(params: Rooms.SetMemberPositionParams): Rooms.SetMemberPosition;
    /**
     * Obtains a list of recordings for the current room session. To download the
     * actual mp4 file, please use the [REST
     * API](https://developer.signalwire.com/apis/reference/overview).
     *
     * @permissions
     *  - `room.recording`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * await room.getRecordings()
     * ```
     *
     * From your server, you can obtain the mp4 file using the [REST API](https://developer.signalwire.com/apis/reference/overview):
     * ```typescript
     * curl --request GET \
     *      --url https://<yourspace>.signalwire.com/api/video/room_recordings/<recording_id> \
     *      --header 'Accept: application/json' \
     *      --header 'Authorization: Basic <your API token>'
     * ```
     */
    getRecordings(): Rooms.GetRecordings;
    /**
     * Starts the recording of the room. You can use the returned
     * {@link RoomSessionRecording} object to control the recording (e.g., pause,
     * resume, stop).
     *
     * @permissions
     *  - `room.recording`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * const rec = await room.startRecording()
     * await rec.stop()
     * ```
     */
    startRecording(): Promise<Rooms.RoomSessionRecording>;
    /**
     * Obtains a list of recordings for the current room session.
     *
     * @permissions
     *  - `room.playback`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @returns The returned objects contain all the properties of a
     * {@link RoomSessionPlayback}, but no methods.
     */
    getPlaybacks(): Rooms.GetPlaybacks;
    /**
     * Starts a playback in the room. You can use the returned
     * {@link RoomSessionPlayback} object to control the playback (e.g., pause,
     * resume, setVolume and stop).
     *
     * @permissions
     *  - `room.playback`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * const playback = await roomSession.play({ url: 'rtmp://example.com/foo' })
     * await playback.stop()
     * ```
     */
    play(params: Rooms.PlayParams): Promise<Rooms.RoomSessionPlayback>;
    /**
     * Assigns custom metadata to the RoomSession. You can use this to store
     * metadata whose meaning is entirely defined by your application.
     *
     * Note that calling this method overwrites any metadata that had been
     * previously set on this RoomSession.
     *
     * @param meta The medatada object to assign to the RoomSession.
     *
     * @permissions
     *  - `room.set_meta`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```js
     * await roomSession.setMeta({ foo: 'bar' })
     * ```
     */
    setMeta(params: Rooms.SetMetaParams): Rooms.SetMeta;
    /**
     * Retrieve the custom metadata for the RoomSession.
     *
     * @example
     * ```js
     * const { meta } = await roomSession.getMeta()
     * ```
     */
    getMeta(): Rooms.GetMeta;
    updateMeta(params: Rooms.UpdateMetaParams): Rooms.UpdateMeta;
    deleteMeta(params: Rooms.DeleteMetaParams): Rooms.DeleteMeta;
    /**
     * Assigns custom metadata to the specified RoomSession member. You can use
     * this to store metadata whose meaning is entirely defined by your
     * application.
     *
     * Note that calling this method overwrites any metadata that had been
     * previously set on the specified member.
     *
     * @param params.memberId Id of the member to affect. If omitted, affects the
     * default device in the local client.
     * @param params.meta The medatada object to assign to the member.
     *
     * @permissions
     *  - `room.self.set_meta`: to set the metadata for the local member
     *  - `room.member.set_meta`: to set the metadata for a remote member
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * Setting metadata for the current member:
     * ```js
     * await roomSession.setMemberMeta({
     *   meta: {
     *     email: 'joe@example.com'
     *   }
     * })
     * ```
     *
     * @example
     * Setting metadata for another member:
     * ```js
     * await roomSession.setMemberMeta({
     *   memberId: 'de550c0c-3fac-4efd-b06f-b5b8614b8966'  // you can get this from getMembers()
     *   meta: {
     *     email: 'joe@example.com'
     *   }
     * })
     * ```
     */
    setMemberMeta(params: Rooms.SetMemberMetaParams): Rooms.SetMemberMeta;
    /**
     * Retrieve the custom metadata for the specified RoomSession member.
     *
     * @param params.memberId Id of the member to retrieve the meta. If omitted, fallback to the current memberId.
     *
     * @example
     * ```js
     * const { meta } = await roomSession.getMemberMeta({ memberId: 'de550c0c-3fac-4efd-b06f-b5b8614b8966' })
     * ```
     */
    getMemberMeta(params?: MemberCommandParams): Rooms.GetMemberMeta;
    updateMemberMeta(params: Rooms.UpdateMemberMetaParams): Rooms.UpdateMemberMeta;
    deleteMemberMeta(params: Rooms.DeleteMemberMetaParams): Rooms.DeleteMemberMeta;
    promote(params: Rooms.PromoteMemberParams): Rooms.PromoteMember;
    demote(params: Rooms.DemoteMemberParams): Rooms.DemoteMember;
    /**
     * Obtains a list of streams for the current room session.
     *
     * @permissions
     *  - `room.stream`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * await room.getStreams()
     * ```
     */
    getStreams(): Rooms.GetStreams;
    /**
     * Starts to stream the room to the provided URL. You can use the returned
     * {@link RoomSessionStream} object to then stop the stream.
     *
     * @permissions
     *  - `room.stream.start` or `room.stream`
     *
     * You need to specify the permissions when [creating the Video Room
     * Token](https://developer.signalwire.com/apis/reference/create_room_token)
     * on the server side.
     *
     * @example
     * ```typescript
     * const stream = await room.startStream({ url: 'rtmp://example.com' })
     * await stream.stop()
     * ```
     */
    startStream(params: Rooms.StartStreamParams): Promise<Rooms.RoomSessionStream>;
}
/**
 * VideoRoomSession properties
 */
export declare type VideoRoomSessionEntity = OnlyStateProperties<VideoRoomSessionContract>;
/**
 * VideoRoomSession methods
 */
export declare type VideoRoomSessionMethods = OnlyFunctionProperties<VideoRoomSessionContract>;
/**
 * VideoRoomSessionEntity plus `updated` field
 */
export declare type VideoRoomSessionEntityUpdated = EntityUpdated<VideoRoomSessionEntity>;
/**
 * VideoRoomSessionEntity for internal usage (converted to snake_case)
 * @internal
 */
export declare type InternalVideoRoomSessionEntity = {
    [K in NonNullable<keyof VideoRoomSessionEntity> as CamelToSnakeCase<K>]: VideoRoomSessionEntity[K];
};
/**
 * VideoRoomEntity for internal usage only: backwards compat.
 * @internal
 * @deprecated
 */
declare type InternalVideoRoomEntity = {
    room_id: string;
    room_session_id: string;
    event_channel: string;
    name: string;
    recording: boolean;
    hide_video_muted: boolean;
    preview_url?: string;
};
/**
 * VideoRoomSessionEntity plus `updated` field
 * for internal usage (converted to snake_case)
 * @internal
 */
export declare type InternalVideoRoomUpdated = EntityUpdated<InternalVideoRoomSessionEntity>;
export interface InternalVideoRoomJoinedEvent extends SwEvent {
    event_type: ToInternalVideoEvent<RoomJoined>;
    params: VideoRoomSubscribedEventParams;
}
export interface InternalVideoRoomAudienceCountEvent extends SwEvent {
    event_type: ToInternalVideoEvent<RoomAudienceCount>;
    params: VideoRoomAudienceCountEventParams;
}
export declare type InternalVideoRoomEvent = InternalVideoRoomJoinedEvent | InternalVideoRoomAudienceCountEvent;
/**
 * ==========
 * ==========
 * Server-Side Events
 * ==========
 * ==========
 */
/**
 * 'video.room.started'
 */
export interface VideoRoomStartedEventParams {
    room_id: string;
    room_session_id: string;
    room: InternalVideoRoomEntity;
    room_session: InternalVideoRoomSessionEntity;
}
export interface VideoRoomStartedEvent extends SwEvent {
    event_type: ToInternalVideoEvent<RoomStarted>;
    params: VideoRoomStartedEventParams;
}
/**
 * 'video.room.subscribed'
 */
export interface VideoRoomSubscribedEventParams {
    room: InternalVideoRoomEntity & {
        members: InternalVideoMemberEntity[];
    };
    room_session: InternalVideoRoomSessionEntity & {
        members: InternalVideoMemberEntity[];
    };
    call_id: string;
    member_id: string;
}
export interface VideoRoomSubscribedEvent extends SwEvent {
    event_type: ToInternalVideoEvent<RoomSubscribed>;
    params: VideoRoomSubscribedEventParams;
}
/**
 * 'video.room.updated'
 */
export interface VideoRoomUpdatedEventParams {
    room_id: string;
    room_session_id: string;
    room: InternalVideoRoomEntity;
    room_session: InternalVideoRoomSessionEntity;
}
export interface VideoRoomUpdatedEvent extends SwEvent {
    event_type: ToInternalVideoEvent<RoomUpdated>;
    params: VideoRoomUpdatedEventParams;
}
/**
 * 'video.room.ended'
 */
export interface VideoRoomEndedEventParams {
    room_id: string;
    room_session_id: string;
    room: InternalVideoRoomEntity;
    room_session: InternalVideoRoomSessionEntity;
}
export interface VideoRoomEndedEvent extends SwEvent {
    event_type: ToInternalVideoEvent<RoomEnded>;
    params: VideoRoomEndedEventParams;
}
/**
 * 'video.room.audience_count'
 */
export interface VideoRoomAudienceCountEventParams {
    room_id: string;
    room_session_id: string;
    total: number;
}
export interface VideoRoomAudienceCountEvent extends SwEvent {
    event_type: ToInternalVideoEvent<InternalRoomAudienceCount>;
    params: VideoRoomAudienceCountEventParams;
}
export declare type VideoRoomEvent = VideoRoomStartedEvent | VideoRoomSubscribedEvent | VideoRoomUpdatedEvent | VideoRoomEndedEvent;
export declare type VideoRoomEventParams = VideoRoomStartedEventParams | VideoRoomSubscribedEventParams | VideoRoomUpdatedEventParams | VideoRoomEndedEventParams;
export {};
//# sourceMappingURL=videoRoomSession.d.ts.map