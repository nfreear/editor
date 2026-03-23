// Import relies on an "importmap".
import {
  ClassicEditor, Essentials, Bold, Italic, Font, Heading,
  GeneralHtmlSupport, Image, ImageToolbar, ImageUpload,
  Link, List, Paragraph, SourceEditing, WordCount
} from 'ckeditor5';
import AltTextHelpPlugin from './AltTextHelpPlugin.js';
// import { FormatPainter } from 'ckeditor5-premium-features';
// import * as MOD from '@ckeditor/ckeditor5-inspector';

const { HTMLElement } = window;

/**
 * MyEditorElement custom element.
 *
 * @customElement my-editor
 * @copyright © Nick Freear, 21-March-2026.
 *
 * @see https://codepen.io/nfreear/pen/jEMwgjv
 * @see https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/cloud/quick-start.html#advanced-setup-with-import-maps
 * @see https://ckeditor.com/docs/ckeditor5/latest/examples/builds/classic-editor.html
 * @see https://ckeditor.com/docs/ckeditor5/latest/features/html/general-html-support.html
 * @see https://github.com/ckeditor/ckeditor5-demos/blob/master/user-interface-classic/index.js
 * @see https://cdn.ckeditor.com/ckeditor5-premium-features/47.6.1/ckeditor5-premium-features.css
 */
export default class MyEditorElement extends HTMLElement {
  #licenseKey = 'GPL'; // '<YOUR_LICENSE_KEY>';
  #plugins = [Essentials, Bold, Italic, Font, Heading, Link, List, Image, ImageToolbar, ImageUpload, Paragraph, SourceEditing, WordCount, GeneralHtmlSupport, AltTextHelpPlugin];
  #defaultToolbar = [
    'accessibilityHelp', '|',
    'undo', 'redo', '|', 'heading', '|',
    'bulletedList', 'numberedList', '|', 'link', 'uploadImage', '|',
    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
    '|', 'bold', 'italic', '|', 'sourceEditing' /* , '|', 'formatPainter' */
  ];

  #htmlSupport = {
    allow: [
      { name: 'small' },
      { name: 'p', classes: true }
    ]
  };

  #editor;
  #inspector;

  get #inspect () { return this.hasAttribute('inspect') || this.hasAttribute('debug'); }
  get #langUI () { return this.getAttribute('lang-ui'); }
  get #localeImportPath () { return `ckeditor5/translations/${this.#langUI}.js`; }
  get #version () { return window.CKEDITOR_VERSION; }

  get #toolbar () {
    const attr = this.getAttribute('toolbar');
    if (attr) {
      const toolbarArray = attr.replace(/(\w)\|(\w)/g, '$1,|,$2').split(',');
      return toolbarArray;
    } else {
      return this.#defaultToolbar;
    }
  }

  async #importTranslations () {
    if (this.#langUI) {
      const { default: coreTranslations } = await import(this.#localeImportPath);
      return coreTranslations;
    }
  }

  /** @see https://ckeditor.com/docs/ckeditor5/latest/framework/develpment-tools/inspector.html
  */
  #attachInspector (editorInstance) {
    if (this.#inspect) {
      import('@ckeditor/ckeditor5-inspector').then((M) => {
        const { CKEditorInspector } = window;
        this.#inspector = CKEditorInspector;
        CKEditorInspector.attach(editorInstance);
      });
    }
  }

  async connectedCallback () {
    const coreTranslations = await this.#importTranslations();

    ClassicEditor.create(this, {
      licenseKey: this.#licenseKey,
      plugins: this.#plugins,
      toolbar: this.#toolbar,
      htmlSupport: this.#htmlSupport,
      image: { toolbar: ['imageTextAlternative'] },
      translations: [coreTranslations],
      wordCount: {
        onUpdate: (stats) => console.debug('CKEditor statistics:', stats)
      }
    })
      .then((editorInst) => {
        this.#editor = editorInst;
        this.#attachInspector(editorInst);
        this.dataset.ready = true;
        // this.#altTextPlugin();
        console.debug('CKEditor loaded OK!', this.#version, [this]);
      })
      .catch((er) => console.error('CKEditor Error:', er));
  }
}
