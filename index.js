/**
 * The live-editor, implmented as an ES6 module.
 */

import * as config from './src/defaults.js';

export class LiveEditor {

  constructor(options = {}) {
    this.CFG = { ...config.default, ...options }; // Merge!

    this.$form = document.querySelector(this.CFG.selector);
    this.$form.classList.add('live-editor-js')
    // const $playButton = $FORM.querySelector('.run');
    this.$console = this.$form.querySelector('.log');
    this.$editor  = this.$form.querySelector('.editor');
    this.$editor.classList.add('javascript', 'lang-js', 'line-numbers')
  }

  start() {
    this.fetchSources();
    this.injectPluginDispatchers();
    this.setupFormHandler();

    setTimeout(() => this.CFG.highlighter(this.$editor), 300);

    console.warn('LiveEditor:', this)
    return this;
  }

  async fetchSources() {
    if (this.CFG.sourceJs) {
      const response = await fetch(this.CFG.sourceJs)
      const source = await response.text();
      this.$editor.textContent = source; // Was: this.$editor.innerText = source;
      console.debug('Editor source loaded!')
    }

    if (this.CFG.preDefinesJs) {
      const definesResp = await fetch(this.CFG.preDefinesJs)
      this.defines = await definesResp.text();
      console.debug('Pre-defines loaded!')
    }
  }

  injectPluginDispatchers () {
    // Inject plugin dispatchers.
    for (const fn in this.CFG.plugins) {
      this.CFG.pluginsCode.push('function ' + fn + '(p){console.warn(`' + fn + ':`, p); postMessage(`fn:' + fn + '(${ JSON.stringify(p) })`)}'); // '(${p})`)}'
    }
    // function stClip(p){ postMessage(`fn:stclip(${ JSON.stringify(p) })`) }
    // function stClip(p){ console.warn('stClip:', p); postMessage({ fn: 'stClip', p }) }
  }

  getSourceCode() {
    // Editor code first, so that error line-numbers are correct!
    return `${ this.$editor.innerText }

  // ${ '='.repeat(56) }
  ${ this.defines }
  ${ this.CFG.pluginsCode.join('\n') }`;
    // Was: const code = `${ this.defines }${ this.CFG.pluginsCode.join('\n') }\n\n${ this.$editor.innerText }`;
  }

  setupFormHandler() {
    this.$form.addEventListener('submit', ev => {
      ev.preventDefault();

      this.CFG.highlighter(this.$editor);

      this.CFG.callbacks.start();

      this.$console.innerHTML = '';

      const code = this.getSourceCode();

      console.debug('>>>> The code >>>>\n', code);

      const codeBlob = new Blob([ code ], { type: 'text/javascript' });

      // convert the blob into a pseudo URL
      const bbURL = URL.createObjectURL(codeBlob);

      this.worker = new Worker(bbURL);

      // add a listener for messages from the Worker
      this.worker.addEventListener('message', ev => this.onWorkerMessage(ev));

      // add a listener for errors from the Worker
      this.worker.addEventListener('error', err => {
        const string = (err.message).toString();
        this.$console.append(`ERROR: ${string} (line ${ err.lineno })\n`);

        console.error(err)
      });

      // Finally, actually start the worker
      this.worker.postMessage('start');

      // Put a timeout on the worker to automatically kill the worker
      setTimeout(() => {
        this.worker.terminate();
        console.debug('Worker terminated!', this.worker)
        this.worker = null;
      }, this.CFG.timeout);
    });
  }

  onWorkerMessage(ev) {
    const M_CALL = ev.data.match(this.CFG.pluginsRegex);
    const string = (ev.data).toString();
    console.warn('>>', string);
    this.$console.append(`${string} \n`);

    if (M_CALL) {
      const FUNC  = M_CALL[ 1 ];
      const PARAM = M_CALL[ 2 ] === 'undefined' ? undefined : M_CALL[ 2 ];
      // console.debug('Plugin:', M_CALL);

      this.CFG.plugins[ FUNC ]( PARAM );
    }
  }
} // End class.

export { beep } from './src/beep.js';

// window.LiveEditor = LiveEditor;

// --------------------------------------------------------

// console.debug('Check existence of Worker etc.:', Worker, URL, Blob);

// Optional auto-loading.
if (document.querySelector('script[ data-live-editor ^= a ]')) {
  const editor = new LiveEditor()
  editor.start();
}
