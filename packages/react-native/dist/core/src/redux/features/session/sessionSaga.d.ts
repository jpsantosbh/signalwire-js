import { SagaIterator, EventChannel } from '@redux-saga/core';
import { BaseSession } from '../../../BaseSession';
import type { PubSubChannel, SwEventChannel } from '../../interfaces';
declare type SessionSagaParams = {
    session: BaseSession;
    sessionChannel: EventChannel<any>;
    pubSubChannel: PubSubChannel;
    swEventChannel: SwEventChannel;
};
/**
 * Watch every "executeAction" and fork the worker to send
 * a JSONRPC over the wire and then update the state
 * with "componentActions.executeSuccess" or "componentActions.executeFailure"
 * actions if a componentId is provided.
 */
export declare function executeActionWatcher(session: BaseSession): SagaIterator;
export declare function sessionChannelWatcher({ sessionChannel, pubSubChannel, swEventChannel, session, }: SessionSagaParams): SagaIterator;
export declare function createSessionChannel(session: BaseSession): EventChannel<import("@redux-saga/types").NotUndefined>;
export {};
//# sourceMappingURL=sessionSaga.d.ts.map