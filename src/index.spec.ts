import { stub } from 'sinon';
import { throttleQueue } from './index';

describe('throttleQueue', () => {
    it('executes the first call with the correct params in the next frame, by default, and delays subsequent calls', (finish) => {
        const callbackStub = stub();
        const argStub1 = { arbitraryKey: 'arbitraryValue' };
        const argStub2 = { arbitraryKey: 'arbitraryValue' };
        const argStub3 = { arbitraryKey: 'arbitraryValue' };
        const throttleQueuedCallback = throttleQueue(callbackStub, 200);

        expect(callbackStub.callCount).toStrictEqual(0);

        throttleQueuedCallback(argStub1); // called immediately.
        throttleQueuedCallback(argStub2); // called after 200ms.
        throttleQueuedCallback(argStub3); // called after 400ms.

        // delay assertion by 10ms to give JS time to execute the callback in the next frame.
        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(1);
            expect(callbackStub.lastCall.args[0]).toStrictEqual(argStub1);
        }, 10);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(2);
            expect(callbackStub.lastCall.args[0]).toStrictEqual(argStub2);
        }, 300);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(3);
            expect(callbackStub.lastCall.args[0]).toStrictEqual(argStub3);
            finish();
        }, 500);
    });

    it('executes the first call with the correct params after the delay if skipInitialDelay is disabled', (finish) => {
        const callbackStub = stub();
        const argStub1 = { arbitraryKey: 'arbitraryValue' };
        const argStub2 = { arbitraryKey: 'arbitraryValue' };
        const throttleQueuedCallback = throttleQueue(
            callbackStub, 200, { skipInitialDelay: false }
        );

        expect(callbackStub.callCount).toStrictEqual(0);

        throttleQueuedCallback(argStub1); // called after 200ms.
        throttleQueuedCallback(argStub2); // called after 400ms.

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(0);
        }, 100);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(1);
            expect(callbackStub.lastCall.args[0]).toStrictEqual(argStub1);
        }, 300);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(2);
            expect(callbackStub.lastCall.args[0]).toStrictEqual(argStub2);
            finish();
        }, 500);
    });

    it('executes a subsequent call in the next frame if the queue has been cleared and the delay has passed', (finish) => {
        const callbackStub = stub();
        const throttleQueuedCallback = throttleQueue(callbackStub, 200);

        throttleQueuedCallback(); // called in the next frame.
        throttleQueuedCallback(); // called after 200ms.
        // the queue will be reset after an additional 200ms.

        // 500ms have passed, the queue should've been reset by now.
        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(2);
            throttleQueuedCallback(); // called immediately

            // delay assertion by 10ms to give JS time to execute the callback in the next frame.
            setTimeout(() => {
                expect(callbackStub.callCount).toEqual(3);
                finish();
            }, 10);
        }, 500);
    });

    it('cancels the queue and does not execute the queued callbacks', (finish) => {
        const callbackStub = stub();
        const throttleQueuedCallback = throttleQueue(
            callbackStub, 200, { skipInitialDelay: false }
        );

        throttleQueuedCallback(); // called after 200ms.
        throttleQueuedCallback(); // called after 400ms.
        throttleQueuedCallback.cancel();

        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(0);
            finish();
        }, 500);
    });

    it('calls a subsequent call in the next frame if the queue has been canceled', (finish) => {
        const callbackStub = stub();
        const throttleQueuedCallback = throttleQueue(callbackStub, 200);

        throttleQueuedCallback(); // called in the next frame.
        throttleQueuedCallback(); // called after 200ms.
        throttleQueuedCallback.cancel();

        expect(callbackStub.callCount).toEqual(0);
        throttleQueuedCallback();

        // delay assertion by 10ms to give JS time to execute the callback in the next frame.
        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(1);
            finish();
        }, 10);
    });

    it('throws a type error if the callback parameter is not a function', () => {
        // @ts-ignore Intentionally passing a wrong type
        expect(() => throttleQueue(1, 200)).toThrowError(TypeError('Expected a function'));

        // @ts-ignore Intentionally passing a wrong type
        expect(() => throttleQueue(undefined, 200)).toThrowError(TypeError('Expected a function'));

        // @ts-ignore Intentionally passing a wrong type
        expect(() => throttleQueue({}, 200)).toThrowError(TypeError('Expected a function'));

        // @ts-ignore Intentionally passing a wrong type
        expect(() => throttleQueue('arbitrary string', 200)).toThrowError(TypeError('Expected a function'));
    });
});
