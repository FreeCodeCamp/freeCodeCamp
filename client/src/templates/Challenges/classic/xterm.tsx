import React, { MutableRefObject, useEffect, useRef } from 'react';
import type { IDisposable, Terminal } from 'xterm';
import type { FitAddon } from 'xterm-addon-fit';

import { registerTerminal } from '../utils/python-worker-handler';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/python-input-sw.js');
    } catch (error) {
      console.error(`Registration failed`);
      console.error(error);
    }
  }
};

export const XtermTerminal = ({
  xtermFitRef,
  dimensions
}: {
  xtermFitRef: MutableRefObject<FitAddon | null>;
  dimensions?: { height: number; width: number };
}) => {
  const termContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void registerServiceWorker();

    let term: Terminal | null;

    async function createTerminal() {
      const disposables: IDisposable[] = [];
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');
      // Setting convertEol so that \n is converted to \r\n. Otherwise the terminal
      // will interpret \n as line feed and just move the cursor to the next line.
      // convertEol makes every \n a \r\n.
      term = new Terminal({ convertEol: true });
      const fitAddon = new FitAddon();
      xtermFitRef.current = fitAddon;
      term.loadAddon(fitAddon);
      if (termContainerRef.current) term.open(termContainerRef.current);
      fitAddon.fit();

      const print = (text?: string) => term?.writeln(`${text ?? ''}`);

      // TODO: prevent user from moving cursor outside the current input line and
      // handle insertion and deletion properly. While backspace and delete don't
      // seem to work, we can use "\x1b[0K" to clear from the cursor to the end.
      // Also, we should not add special characters to the userinput string.
      const input = (text?: string) => {
        print(text);
        let userinput = '';
        // Eslint is correct that this only gets assigned once, but we can't use
        // const because the declaration (before keyListener is defined) and
        // assignment (after keyListener is defined) must be separate.
        // eslint-disable-next-line prefer-const
        let disposable: IDisposable | undefined;

        const done = () => {
          disposable?.dispose();
          navigator.serviceWorker.controller?.postMessage(
            JSON.stringify({
              type: 'msg',
              value: userinput
            })
          );
        };

        const keyListener = (key: string) => {
          if (key === '\u007F' || key === '\b') {
            // Backspace or delete key
            term?.write('\b \b'); // Move cursor back, replace character with space, then move cursor back again
            userinput = userinput.slice(0, -1); // Remove the last character from userinput
          }
          if (key == '\r') {
            term?.write('\r\n');
            done();
          } else {
            userinput += key;
            term?.write(key);
          }
        };

        disposable = term?.onData(keyListener); // Listen for key events and store the disposable
        if (disposable) disposables.push(disposable);
      };
      const reset = () => {
        // Ironically, term.reset(), while synchronous, is not a reliable way to
        // reset the terminal. It does not clear the input buffer, so old print
        // statements can still appear. The \x1bc (ESC c) escape sequence triggers
        // a full terminal reset, which is what we want.
        term?.write('\x1bc');
        disposables.forEach(disposable => disposable.dispose());
        disposables.length = 0;
      };
      registerTerminal({ print, input, reset });
    }

    void createTerminal();

    return () => {
      term?.dispose();
    };
  }, [xtermFitRef]);

  useEffect(() => {
    if (xtermFitRef.current) xtermFitRef.current.fit();

    // dimensions is an implicit dependency, since it's not directly used by the
    // effect, but fitAddon.fit() needs to be called whenever the container size
    // changes.
  }, [xtermFitRef, dimensions]);

  return (
    <div style={{ height: dimensions?.height }} ref={termContainerRef}>
      <link rel='stylesheet' href='/js/xterm.css' />
    </div>
  );
};
