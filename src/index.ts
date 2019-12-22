export interface Options {
    skipInitialDelay: boolean;
}

const defaultOptions: Options = {
    skipInitialDelay: true
};

export const queue = <T>(callback: (args?: T) => void, delay: number, options: Partial<Options> = defaultOptions) => {
    const callbackQueue: {callback: (args?: T) => void, args: T}[] = [];
    let timeout: NodeJS.Timer;

    function cancel() {
        callbackQueue.slice(0, callbackQueue.length);
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
    }

    function queuedCallback(args?: T) {
        callbackQueue.push({callback, args});

        const run = (recursiveDelay = delay) => {
            if (!timeout && callbackQueue.length) {
                timeout = setTimeout(() => {
                    const { callback: queuedCall, args: queuedArgs } = callbackQueue[0];
                    callbackQueue.splice(0, 1);

                    queuedCall(queuedArgs);
                    timeout = undefined;
                    
                    run();
                }, recursiveDelay)
            }
        }

        run(options.skipInitialDelay ? 0 : undefined);
    }

    queuedCallback.cancel = cancel;
    return queuedCallback;
}

export default queue;