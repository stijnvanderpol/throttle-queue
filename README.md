# throttle-queue
<p>
<img src="https://img.shields.io/codeship/3f1b02b0-07ca-0138-5eda-4e0a340c3623" />
<img src="https://img.shields.io/codacy/coverage/0020a313cf07489592b35bbc878af151" /> 
<img src="https://img.shields.io/codacy/grade/0020a313cf07489592b35bbc878af151" />
<img src="https://img.shields.io/npm/types/typescript" />
<img src="https://img.shields.io/github/license/stijnvanderpol/throttle-queue" />
</p>

throttle-queue is a small utility package that provides a simple way to turn a regular function into a throttle queued function.

A throttle queued function will put each call into a queue and then execute them, one by one, with a configurable delay before each execution.

## Summary
- [Example](Example)
- [Options](Options)


## Example
```
import { throttleQueue } from '@sovanderpol/throttle-queue';

const log = (message: string) => {
    console.log(message)
};

const delayInMs = 500;

const throttleQueuedLog = throttleQueue(log, delayInMs);

throttleQueuedLog(1); // called in the next frame
throttleQueuedLog(2); // called after 500ms
throttleQueuedLog(3); // called after 1000ms


setTimeout(() => {
    // 2 seconds have passed. The queue has reset itself by now.
    throttleQueuedLog(4); // called in the next frame
}, 2000);
```
*The following applies for above the code example:*

When `throttleQueuedLog` is called for the first time it executes `log` in the next frame*. The other calls to `throttleQueuedLog` are made within the 500ms threshold, so those calls are put in a queue. Every 500ms one of the queued calls will then be executed in a first-in-first-out order.

Once the queue has been emptied and an additional 500ms have passed, the mechanism resets. The next time `throttleQueuedLog` is called, it executes `log` in the next frame.

\* If the delay is skipped the call will be executed after a timeout of 0ms. I.e. next frame.

## Options
Throttle-queue's behavior can be configured through the optional `options` parameter. Throttle-queue currently supports the following options:
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
// Skip initial delay disabled:

const throttleQueuedCallback = throttleQueue(callback, 500, { skipInitialDelay: false });

throttleQueuedCallback(); // called after 500ms
throttleQueuedCallback(); // called after 1000ms
```