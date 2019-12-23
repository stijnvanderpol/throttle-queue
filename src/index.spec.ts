import { stub } from 'sinon';
import { queue } from './index';

describe('queue', () => {
    it('invokes the first call right away, by default, and delays subsequent calls', (finish) => {
        const callbackStub = stub();
        const queuedCallbackStub = queue(callbackStub, 200);

        expect(callbackStub.callCount).toStrictEqual(0);

        queuedCallbackStub();
        queuedCallbackStub();
        queuedCallbackStub();
    
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

        queuedCallbackStub();
        queuedCallbackStub();

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

        queuedCallbackStub();
        queuedCallbackStub();
        queuedCallbackStub.cancel();

        setTimeout(() => {
            expect(callbackStub.callCount).toEqual(0);
            finish();
        }, 500);
    });

});