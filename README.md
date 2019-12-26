<div align="center">
<h1 style="color: #C00;"><code>throttle-queue</code></h1>
<p>
Utility package that provides a simple way to turn a regular function into a "throttle queued" function.
</p>
<p>
<a href="https://stijnvanderpol.github.io/throttle-queue/" target="_blank">check the demo</a>
</p>
</div>
<hr>
<p>
<img src="https://img.shields.io/codeship/3f1b02b0-07ca-0138-5eda-4e0a340c3623" />
<img src="https://img.shields.io/codacy/coverage/0020a313cf07489592b35bbc878af151" /> 
<img src="https://img.shields.io/codacy/grade/0020a313cf07489592b35bbc878af151" />
<img src="https://img.shields.io/npm/types/typescript" />
<img src="https://img.shields.io/github/license/stijnvanderpol/throttle-queue" />
</p>

A throttle queued function will put each call into a queue and then execute them, one by one, with a configurable delay after each execution. Queued calls can be canceled by using the cancel function.

## Summary
- [Example](Example)
- [Options](Options)


## Quickstart
Install `throttle-queue` using the following command:

```
npm i @sovanderpol/throttle-queue
```

Then import it in your project:
```
import { throttleQueue } from '@sovanderpol/throttle-queue';

// You can also import throttleQueue as a default import
// import throttleQueue from '@sovanderpol/throttle-queue';

/* --------- */

// And change your function into a throttle queued function
const throttleQueuedCallback = throttleQueue(callback, 500);
```
**Detailed implementation examples can be found below.**

You can also import it in a module script tag. Save the contents of <a href="https://raw.githubusercontent.com/stijnvanderpol/throttle-queue/master/dist/throttle-queue.js">this file</a> as `throttle-queue.js` and
import it as a module script:
```
<script type="module">
    import './throttle-queue.js';

    function foo() { ... }

    const throttleQueuedFoo = throttleQueue(foo, 500);
</script>
```
 **An example of this can be found in the <a href="https://stijnvanderpol.github.io/throttle-queue/" target="_blank">demo</a>.**

## Example
```
import { throttleQueue } from '@sovanderpol/throttle-queue';

let counter = 0;

const increaseCounter = (increaseBy: number) => {
    counter += increaseBy;
};

const throttleQueuedIncreaseCounter = throttleQueue(increaseCounter, 500);

throttleQueuedIncreaseCounter(1); // called next frame
throttleQueuedIncreaseCounter(2); // called after 500ms
throttleQueuedIncreaseCounter(3); // called after 1000ms

/* After 1000ms have passed.. */

// counter === 6
```
*The following applies for above the code example:*

When `throttleQueuedIncreaseCounter(1)` is called it executes `increaseCounter(1)` in the next frame*. At this point
a 500ms timer starts. If `throttleQueuedIncreaseCounter` is called before this timer has expired, the new calls
are put in a queue. In the above example `throttleQueuedIncreaseCounter(2)` and `throttleQueuedIncreaseCounter(3)` are called before the timer has finished. So both calls are put in the queue. 

Every 500ms, the call at the front of the queue will be executed. Once the queue has been emptied - and an additional 500ms have passed - the mechanism resets. I.e. the next time `throttleQueuedIncreaseCounter` is called, it executes `increaseCounter` in the next frame* and starts running a 500ms timer again.

\* If the delay is skipped the call will be executed after a timeout of 0ms. I.e. next frame.

## Cancel
Queued calls can be cancelled at any time by calling the `cancel` function.
```
import { throttleQueue } from '@sovanderpol/throttle-queue';

let counter = 0;

const increaseCounter = (increaseBy: number) => {
    counter += increaseBy;
};

const throttleQueuedIncreaseCounter = throttleQueue(increaseCounter, 500);

throttleQueuedIncreaseCounter(1); // called next frame
throttleQueuedIncreaseCounter(2); // called after 500ms
throttleQueuedIncreaseCounter(3); // called after 1000ms

// cancel all queued throttleQueuedIncreaseCounter calls
throttleQueuedIncreaseCounter.cancel();

// counter === 0
```

## Options
`throttle-queue`'s behavior can be configured through the optional `options` parameter. `throttle-queue` currently supports the following options:
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