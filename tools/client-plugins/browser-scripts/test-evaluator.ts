import chai from 'chai';
import { toString as __toString } from 'lodash-es';
import * as helpers from '@freecodecamp/curriculum-helpers';
import { format as __format } from './utils/format';

const ctx: Worker & typeof globalThis = self as unknown as Worker &
  typeof globalThis;

const __utils = (() => {
  const MAX_LOGS_SIZE = 64 * 1024;
  const TRUNCATE_AT = 500_000;

  let logs: string[] = [];

  function flushLogs() {
    if (logs.length) {
      let data = logs.join('\n');
      if (data.length > TRUNCATE_AT) {
        data = `${data.substring(0, TRUNCATE_AT)} Logs truncated. See browser console for more`;
      }
      ctx.postMessage({
        type: 'LOG',
        data: data
      });
      logs = [];
    }
  }

  function pushLogs(logs: string[], args: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    logs.push(args.map(arg => __format(arg)).join(' '));
    if (logs.join('\n').length > MAX_LOGS_SIZE) {
      flushLogs();
    }
  }

  const oldLog = ctx.console.log.bind(ctx.console);
  function proxyLog(...args: string[]) {
    pushLogs(logs, args);
    return oldLog(...args);
  }

  const oldInfo = ctx.console.info.bind(ctx.console);
  function proxyInfo(...args: string[]) {
    pushLogs(logs, args);
    return oldInfo(...args);
  }

  const oldWarn = ctx.console.warn.bind(ctx.console);
  function proxyWarn(...args: string[]) {
    pushLogs(logs, args);
    return oldWarn(...args);
  }

  const oldError = ctx.console.error.bind(ctx.console);
  function proxyError(...args: string[]) {
    pushLogs(logs, args);
    return oldError(...args);
  }

  function log(...msgs: Error[]) {
    if (msgs && msgs[0] && !(msgs[0] instanceof chai.AssertionError)) {
      // discards the stack trace via toString as it only useful to debug the
      // site, not a specific challenge.
      console.log(...msgs.map(msg => msg.toString()));
    }
  }

  const toggleProxyLogger = (on: unknown) => {
    ctx.console.log = on ? proxyLog : oldLog;
    ctx.console.info = on ? proxyInfo : oldInfo;
    ctx.console.warn = on ? proxyWarn : oldWarn;
    ctx.console.error = on ? proxyError : oldError;
  };

  return {
    log,
    toggleProxyLogger,
    flushLogs
  };
})();

// We freeze these two to prevent learners from getting the tester into a weird
// state.
Object.freeze(self);
Object.freeze(__utils);

interface TestEvaluatorEvent extends MessageEvent {
  data: {
    code: {
      contents: string;
      editableContents: string;
      original: { [id: string]: string };
    };
    firstTest: unknown;
    testString: string;
    build: string;
    sources: {
      [fileName: string]: unknown;
    };
  };
}

/* Run the test if there is one.  If not just evaluate the user code */
ctx.onmessage = async (e: TestEvaluatorEvent) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const code = (e.data?.code?.contents || '').slice();
  const editableContents = (e.data?.code?.editableContents || '').slice();

  const assert = chai.assert;
  const __helpers = helpers;
  // Similarly to self and __utils, if the learner tries to modify these, weird
  // behavior may result. Freezing them means they get an error instead.
  Object.freeze(assert);
  Object.freeze(__helpers);
  // Fake Deep Equal dependency
  const DeepEqual = (a: unknown, b: unknown) =>
    JSON.stringify(a) === JSON.stringify(b);

  // Build errors should be reported, but only once:
  __utils.toggleProxyLogger(e.data.firstTest);
  /* eslint-enable @typescript-eslint/no-unused-vars */
  try {
    let testResult;
    // This can be reassigned by the eval inside the try block, so it should be declared as a let
    // eslint-disable-next-line prefer-const
    let __userCodeWasExecuted = false;
    try {
      // Logging is proxyed after the build to catch console.log messages
      // generated during testing.
      testResult = (await eval(`${e.data.build}
__utils.flushLogs();
__userCodeWasExecuted = true;
__utils.toggleProxyLogger(true);
(async () => {${e.data.testString}})()`)) as unknown;
    } catch (err) {
      if (__userCodeWasExecuted) {
        // rethrow error, since test failed.
        throw err;
      }
      // log build errors unless they're related to import/export/require (there
      // are challenges that use them and they should not trigger warnings)
      if (
        (err as Error).name !== 'ReferenceError' ||
        ((err as Error).message !== 'require is not defined' &&
          (err as Error).message !== 'exports is not defined')
      ) {
        __utils.log(err as Error);
      }
      // the tests may not require working code, so they are evaluated even if
      // the user code does not get executed.
      testResult = eval(e.data.testString) as unknown;
    }
    if (typeof testResult === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await testResult((fileName: string) =>
        __toString(e.data.sources[fileName])
      );
    }
    __utils.flushLogs();
    ctx.postMessage({ pass: true });
  } catch (err) {
    // Errors from testing go to the browser console only.
    __utils.toggleProxyLogger(false);
    // Report execution errors in case user code has errors that are only
    // uncovered during testing.
    __utils.log(err as Error);
    // Now that all logs have been created we can flush them.
    __utils.flushLogs();
    ctx.postMessage({
      err: {
        message: (err as Error).message,
        stack: (err as Error).stack,
        expected: (err as { expected?: string }).expected,
        actual: (err as { actual?: string }).actual
      }
    });
  }
};

ctx.postMessage({ type: 'contentLoaded' });
