import { stub } from 'sinon';
import { queue } from './index';

describe('queue', () => {
    it('invokes the first call right away, by default, and delays subsequent calls', (finish) => {
        const callbackStub = stub();
        const queuedCallbackStub = queue(callbackStub, 200);

        expect(callbackStub.callCount).toStrictEqual(0);

        queuedCallbackStub(); // called immediately
        queuedCallbackStub(); // called after 200ms
        queuedCallbackStub(); // called after 400ms
    
        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(1);
        }, 100);
        
        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(2);
        }, 300);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(3);
            finish();
        }, 500);
    });

    it('invokes the first call after the delay if skipInitialDelay is disabled', (finish) => {
        const callbackStub = stub();
        const queuedCallbackStub = queue(callbackStub, 200, { skipInitialDelay: false });

        expect(callbackStub.callCount).toStrictEqual(0);

        queuedCallbackStub(); // called after 200ms
        queuedCallbackStub(); // called after 400ms

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(0);
        }, 100);
        
        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(1);
        }, 300);

        setTimeout(() => {
            expect(callbackStub.callCount).toStrictEqual(2);
            finish();
        }, 500);
    });

    it('cancels the queue and does not execute the queued callbacks', (finish) => {
        const callbackStub = stub();
        const queuedCallbackStub = queue(callbackStub, 200, { skipInitialDelay: false });

        queuedCallbackStub(); // called after 200ms
        queuedCallbackStub(); // called after 400ms
        queuedCallbackStub.cancel();

        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(0);
            finish();
        }, 500);
    });
    
    it('calls a subsequent call immediately if the queue has been cleared and the delay has passed', (finish) => {
        const callbackStub = stub();
        const queuedCallback = queue(callbackStub, 200);
        
        queuedCallback(); // called immediately
        queuedCallback(); // called after 200ms
        // the queue will be reset after an additional 200ms. 

        // 500ms have passed, the queue should've been reset by now.
        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(2);
            queuedCallback(); // called immediately
            
            // delay assertion by 10ms to take into account that "immediate" calls are executed 1 frame later.
            setTimeout(() => {
                expect(callbackStub.callCount).toEqual(3);
                finish();
            }, 10);
        }, 500)
    });
});