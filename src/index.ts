export const queue = <T>(callback: (args: T) => void, delay: number) => {
    const callbackQueue: {callback: (args: T) => void, args: T}[] = [];
    let timeout: NodeJS.Timer;

    return (args: T) => {
        callbackQueue.push({callback, args});

        const run = () => {
            if (!timeout && callbackQueue.length) {
                timeout = setTimeout(() => {
                    const { callback: queuedCallback, args: queuedArgs } = callbackQueue[0];
                    callbackQueue.splice(0, 1);

                    queuedCallback(queuedArgs);
                    timeout = undefined;
                    
                    run();
                }, delay)
            }
        }

        run();
    }
}

export default queue;