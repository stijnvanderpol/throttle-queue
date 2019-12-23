# Queue

Queue is a small utility package that provides a simple way to turn a regular function into a queued function.

A queued function will put each call into a queue and then execute them, one by one, with a configurable delay before each execution.

## Example
```
import { queue } from '@sovanderpol/queue';

const log = (message: string) => {
    console.log(message)
};

const delayInMs = 500;

const queuedLog = queue(Log, delayInMs);

queuedLog(1); // called in the next frame
queuedLog(2); // called after 500ms
queuedLog(3); // called after 1000ms


setTimeout(() => {
    // 2 seconds have passed. The queue has reset itself by now.
    queuedLog(4); // called in the next frame
}, 2000);
```
*The following applies for above the code example:*

When `queuedLog` is called for the first time it executes `log` in the next frame*. The other calls to `queuedLog` are made within the 500ms threshold, so those calls are put in a queue. Every 500ms one of the queued calls will then be executed in a first-in-first-out order.

Once the queue has been emptied and an additional 500ms have passed, the mechanism resets. The next time `queuedLog` is called, it executes `log` in the next frame.

\* If the delay is skipped the call will be executed after a timeout of 0ms. I.e. next frame.

## Options
Queue's behavior can be configured through the optional `options` parameter. Queue currently supports the following options:
<table>
    <tr>
        <th>property</th>
        <th>default</th>
        <th>description</th>
    </tr>
    <tr>
        <td valign="top">skipInitialDelay</td>
        <td valign="top">true</td>
        <td valign="top">Skips the delay on the first call and executes it in the next frame.</td>
    </tr>
</table>

#### skipInitialDelay Code Example
```
    const queuedCallback = queue(callback, 500, { skipInitialDelay: false });

    queuedCallback(); // called after 500ms
    queuedCallback(); // called after 1000ms
```