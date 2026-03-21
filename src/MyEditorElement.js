import {
 ClassicEditor, Essentials, Bold, Italic, Font, Heading,
 Image, ImageCaption, ImageToolbar, ImageUpload,
 Link, List, Paragraph, SourceEditing, WordCount,
} from 'ckeditor5';
// import { FormatPainter } from 'ckeditor5-premium-features';

/**
 * MyEditorElement
 *
 * @see https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/cloud/quick-start.html#advanced-setup-with-import-maps
 * @see https://ckeditor.com/docs/ckeditor5/latest/examples/builds/classic-editor.html
 * @see https://github.com/ckeditor/ckeditor5-demos/blob/master/user-interface-classic/index.js
 * @see https://cdn.ckeditor.com/ckeditor5-premium-features/47.6.1/ckeditor5-premium-features.css
 */
export default class MyEditorElement extends HTMLElement {
  #licenseKey = 'GPL'; // '<YOUR_LICENSE_KEY>';
	#plugins = [ Essentials, Bold, Italic, Font, Heading, Link, List, Image, ImageCaption, ImageToolbar, ImageUpload, Paragraph, SourceEditing, WordCount /* , FormatPainter */ ];
  #defaultToolbar = [
    'accessibilityHelp', '|',
		'undo', 'redo', '|', 'heading', '|',
    'bulletedList', 'numberedList', '|', 'link', 'uploadImage', '|',
		'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
    '|', 'bold', 'italic', '|', 'sourceEditing' /* , '|', 'formatPainter' */
	];
  #editor;

  get #langUI () { return this.getAttribute('lang-ui'); }
  get #localeImportPath () { return `ckeditor5/translations/${this.#langUI}.js`; }

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

  async connectedCallback () {
    const coreTranslations = await this.#importTranslations();

    ClassicEditor.create(this, {
	    licenseKey: this.#licenseKey,
	    plugins: this.#plugins,
      toolbar: this.#toolbar,
      image: {
        toolbar: [ 'imageTextAlternative' ]
      },
      translations: [ coreTranslations ],
      wordCount: {
        onUpdate: (stats) => console.debug('Stats:', stats)
      }
    })
      .then((instance) => {
        this.#editor = instance;
        console.debug('CKEditor loaded OK!', [this], [ClassicEditor]);
      })
	    .catch((er) => console.error('CKEditor Error:', er));
  }
}
