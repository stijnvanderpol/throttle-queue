export interface Options {
    skipInitialDelay: boolean;
}

const defaultOptions: Options = {
    skipInitialDelay: true
};

/**
 * Returns a throttleQueued function that when called will store the calls in a queue
 * and execute them one by one after the provided delay. The first call will be executed
 * in the next frame unless configured otherwise.
 * @param callback The function to transform into a throttleQueued function.
 * @param delay    The time in milliseconds between each queued function execution.
 * @param options  Optional object with configuration properties.
 */
export const throttleQueue = <T extends (...args: any) => any>(
    callback: T,
    delay: number, options: Partial<Options> = defaultOptions
) => {
    if (typeof callback !== 'function') {
        throw new TypeError('Expected a function');
    }

    const callbackQueue: {callback: T, args: Parameters<T>}[] = [];
    let timeout: NodeJS.Timer;

    function cancel() {
        callbackQueue.slice(0, callbackQueue.length);
        clearTimeout(timeout);
        timeout = undefined;
    }

    function queuedCallback(...args: Parameters<T>) {
        callbackQueue.push({ callback, args });

        const run = (recursiveDelay = delay) => {
            if (!timeout && callbackQueue.length) {
                timeout = setTimeout(() => {
                    const { callback: queuedCall, args: queuedArgs } = callbackQueue[0];
                    callbackQueue.splice(0, 1);

                    queuedCall(...queuedArgs);
                    timeout = undefined;

                    run();
                }, recursiveDelay);
            }
        };

        run(options.skipInitialDelay ? 0 : undefined);
    }

    queuedCallback.cancel = cancel;
    return queuedCallback;
};

export default throttleQueue;
