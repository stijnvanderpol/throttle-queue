import { stub } from 'sinon';
import { throttleQueue } from './index';

describe('throttleQueue', () => {
    it('executes the first call with the correct params in the next frame, by default, and delays subsequent calls', (finish) => {
        const callbackStub = stub();
        const call1Arg1Stub = { arbitraryKey: 'call 1 arg 1' };
        const call1Arg2Stub = { arbitraryKey: 'call 1 arg 2' };
        const call2Arg1Stub = { arbitraryKey: 'call 2 arg 1' };
        const call3Arg1Stub = { arbitraryKey: 'call 3 arg 1' };
        const call3Arg2Stub = { arbitraryKey: 'call 3 arg 2' };
        const call3Arg3Stub = { arbitraryKey: 'call 3 arg 3' };

        const throttleQueuedCallback = throttleQueue(callbackStub, 200);

        expect(callbackStub.callCount).toStrictEqual(0);

        throttleQueuedCallback(call1Arg1Stub, call1Arg2Stub); // called next frame.
        throttleQueuedCallback(call2Arg1Stub); // called after 200ms.
        throttleQueuedCallback(call3Arg1Stub, call3Arg2Stub, call3Arg3Stub); // called after 400ms.

        // delay assertion by 10ms to give JS time to execute the callback in the next frame.
        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(1);
            expect(callbackStub.lastCall.args).toStrictEqual([call1Arg1Stub, call1Arg2Stub]);
        }, 10);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(2);
            expect(callbackStub.lastCall.args).toStrictEqual([call2Arg1Stub]);
        }, 300);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(3);
            expect(callbackStub.lastCall.args).toStrictEqual(
                [call3Arg1Stub, call3Arg2Stub, call3Arg3Stub]
            );
            finish();
        }, 500);
    });

    it('executes the first call with the correct params after the delay if skipInitialDelay is disabled', (finish) => {
        const callbackStub = stub();
        const call1Arg1 = { arbitraryKey: 'arbitraryValue' };
        const call2Arg1 = { arbitraryKey: 'arbitraryValue' };
        const throttleQueuedCallback = throttleQueue(
            callbackStub, 200, { skipInitialDelay: false }
        );

        expect(callbackStub.callCount).toStrictEqual(0);

        throttleQueuedCallback(call1Arg1); // called after 200ms.
        throttleQueuedCallback(call2Arg1); // called after 400ms.

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(0);
        }, 100);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(1);
            expect(callbackStub.lastCall.args[0]).toStrictEqual(call1Arg1);
        }, 300);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(2);
            expect(callbackStub.lastCall.args[0]).toStrictEqual(call2Arg1);
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
            throttleQueuedCallback(); // called after 200ms

            // delay assertion by 10ms to give JS time to execute the callback in the next frame.
            setTimeout(() => {
                expect(callbackStub.callCount).toEqual(3);
            }, 10);

            setTimeout(() => {
                expect(callbackStub.callCount).toEqual(4);
                finish();
            }, 250);
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
        throttleQueuedCallback(); // called next frame.
        throttleQueuedCallback(); // called after 200ms.

        // delay assertion by 10ms to give JS time to execute the callback in the next frame.
        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(1);
        }, 10);

        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(2);
            finish();
        }, 1000);
    });

    describe('parameter validation', () => {
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

        it('does not throw an error if a positive number is passed as delay parameter', () => {
            expect(throttleQueue(() => {}, 0)).not.toThrow();
            expect(throttleQueue(() => {}, 1)).not.toThrow();
        });

        it('throws a type error if the delay parameter is a negative number', () => {
            expect(() => throttleQueue(() => {}, -1)).toThrowError(TypeError('Expected a positive number. Instead received -1.'));
        });

        it('throws a type error if the delay parameter is not a number', () => {
            expect(() => throttleQueue(() => {}, undefined)).toThrowError(TypeError('Expected a positive number. Instead received undefined.'));
            expect(() => throttleQueue(() => {}, null)).toThrowError(TypeError('Expected a positive number. Instead received object.'));

            // @ts-ignore intentionally passing a wrong type
            expect(() => throttleQueue(() => {}, {})).toThrowError(TypeError('Expected a positive number. Instead received object.'));

            // @ts-ignore intentionally passing a wrong type
            expect(() => throttleQueue(() => {}, '')).toThrowError(TypeError('Expected a positive number. Instead received string.'));
        });
    });
});
