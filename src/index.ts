export interface Options {
    skipInitialDelay: boolean;
}

const defaultOptions: Options = {
    skipInitialDelay: true
};

export const queue = <T>(callback: (args?: T) => void, delay: number, options: Partial<Options> = defaultOptions) => {
    const callbackQueue: {callback: (args?: T) => void, args: T}[] = [];
    let timeout: NodeJS.Timer;

    return (args?: T) => {
        callbackQueue.push({callback, args});

        const run = (recursiveDelay = delay) => {
            if (!timeout && callbackQueue.length) {
                timeout = setTimeout(() => {
                    const { callback: queuedCallback, args: queuedArgs } = callbackQueue[0];
                    callbackQueue.splice(0, 1);

                    queuedCallback(queuedArgs);
                    timeout = undefined;
                    
                    run();
                }, recursiveDelay)
            }
        }

        run(options.skipInitialDelay ? 0 : undefined);
    }
}

export default queue;