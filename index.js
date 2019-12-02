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
  }

  start() {
    this.fetchSources();
    this.injectPluginDispatchers();
    this.setupFormHandler();

    setTimeout(() => this.CFG.highlighter(this.$editor), 600);

    console.warn('LiveEditor:', this)
    return this;
  }

  async fetchSources() {
    if (this.CFG.sourceJs) {
      const response = await fetch(this.CFG.sourceJs)
      const source = await response.text();
      this.$editor.innerText = source;
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
    for (const fnName in this.CFG.plugins) {
      this.CFG.pluginsCode.push('function ' + fnName + '(p){postMessage(`' + fnName + '(${p})`)}');
    }
  }

  setupFormHandler() {
    this.$form.addEventListener('submit', ev => {
      ev.preventDefault();

      this.CFG.highlighter(this.$editor);

      this.$console.innerHTML = '';

      const code = `${ this.defines }${ this.CFG.pluginsCode.join('\n') }\n\n${ this.$editor.innerText }`;

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
        this.$console.append(`ERROR: ${string} \n`);
      });

      // Finally, actually start the worker
      this.worker.postMessage('start');

      // Put a timeout on the worker to automatically kill the worker
      setTimeout(() => {
        this.worker.terminate();
        console.warn('Worker terminated!', this.worker)
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
      console.debug('Plugin:', M_CALL);

      this.CFG.plugins[ FUNC ]( PARAM );
    }
  }
} // End class.

export { beep } from './src/beep.js';

// --------------------------------------------------------

// console.debug('Check existence of Worker etc.:', Worker, URL, Blob);

// Optional auto-loading.
if (document.querySelector('script[ data-live-editor ^= a ]')) {
  const editor = new LiveEditor()
  editor.start();
}
