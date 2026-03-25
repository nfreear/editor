const { HTMLElement } = window;

/**
 * Inject HTML and SVG directly into a page via a temporary Iframe element.
 * Uses progressive enhancement!
 *
 * @customElement import-editor
 * @see https://www.filamentgroup.com/lab/html-includes/
 * @see https://codepen.io/piccalilli/project/editor/DyVyPG
 */
export default class ImportContentElement extends HTMLElement {
  #iframeSrc;

  get #iframe () { return this.querySelector('iframe[ src ]'); }

  connectedCallback () {
    console.assert(this.#iframe, 'Missing required <iframe> child element');

    const children = [...this.#iframe.contentDocument.body.children];

    children.forEach((child) => this.#iframe.before(child));

    this.#iframeSrc = this.#iframe.src;
    console.debug('import-content:', [this]);

    this.#iframe.remove();
  }
}
