import { stub } from 'sinon';
import { queue } from './index';

describe('queue', () => {
    it('invokes the first call right away and delays subsequent calls', (finish) => {
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
})