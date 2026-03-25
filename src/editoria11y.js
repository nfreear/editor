import * as editoria11y from '../editoria11y/ed11y.esm.js';
// Was: import * as editoria11y from 'editoria11y';

const { HTMLElement } = window;

/**
 * Minimal Editoria11y custom element.
 *
 * @customElement my-editoria11y
 * @see https://github.com/itmaybejj/editoria11y
 * @see https://editoria11y.princeton.edu/install/v3-configuration/
 */
export default class MyEditoria11yElement extends HTMLElement {
  #editoria11y; // Introspect the module!
  #instance;

  get #checkRoot () { return this.getAttribute('check-root') ?? 'body'; }
  get #checkRoots () { return this.#checkRoot ? [this.#checkRoot] : null; }
  get #cssUrl () { return this.getAttribute('css-url'); }
  get #cssUrls () { return this.#cssUrl ? [this.#cssUrl] : null; }

  #assertions () {
    console.assert(this.#checkRoots, '"check-root" attribute is required.');
    console.assert(this.#cssUrls, '"css-url" attribute is required.');
    console.assert(editoria11y, 'Editoria11y ES6 module not found.');
    console.assert(editoria11y.Ed11y, 'Ed11y class not found.');
  }

  connectedCallback () {
    this.#assertions();
    this.#editoria11y = editoria11y;

    const { Ed11y, version } = editoria11y;

    this.#instance = new Ed11y({
      checkRoots: this.#checkRoots,
      cssUrls: this.#cssUrls
    });

    console.debug('my-editoria11y:', version, [this]);
  }
}

/** @DEPRECATED ~ Testing Editoria11y!
 */
export function editoria11yTest () {
  const { Ed11y } = editoria11y;

  console.log('Editoria11y module (v3):', editoria11y);

  const ed11y = new Ed11y({
    checkRoots: ['main'],
    cssUrls: ['../editoria11y/editoria11y.css']
    // Was: cssUrls: ['assets/editoria11y.css']
  });

  console.log('Editoria11y:', ed11y);
}
