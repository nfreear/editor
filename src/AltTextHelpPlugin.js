// import { EmitterMixin, mix } from 'ckeditor5';

/**
 * CKEditor 5 plugin to provide help and guidance in the UI for the "imageTextAlternative" command.
 *
 * @see https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/plugins.html
 * @see https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/event-system.html
 */
export default class AltTextHelpPlugin {
  #commandName = 'imageTextAlternative';
  #editor;
  #command;
  #ckBodyElement;
  #createdFlag;

  get pluginName () { return 'AltTextHelpPlugin'; }
  get isOfficialPlugin () { return false; }

  get #editorElement () { return this.#editor.ui.view.element; }

  constructor (editorInst) {
    this.#editor = editorInst;
    this.#editor.on('ready', (ev) => this.#editorReady(ev));
  }

  #editorReady (ev) {
    this.#command = this.#editor.commands.get(this.#commandName);
    console.assert(this.#command, 'Missing command');
    this.#command.on('change:isEnabled', async (ev, prop, newVal, oldVal) => this.#isEnabledEvent(ev, prop, newVal, oldVal));

    this.#ckBodyElement = document.querySelector('.ck-body-wrapper');
    console.assert(this.#ckBodyElement, 'Missing ck-body-wrapper element');

    console.debug('AltTextHelpPlugin (CKEditor ready):', ev, this);
  }

  #queryCkBody (selector) {
    return this.#ckBodyElement.querySelector(selector);
  }

  async #isEnabledEvent (ev, propName, newValue, oldValue) {
    await delay();

    if (newValue) {
      const ckButtonElem = this.#queryCkBody('.ck-balloon-panel_with-arrow'); // Was: '.. button'
      console.assert(ckButtonElem, 'Missing button');
      ckButtonElem.addEventListener('click', (ev) => this.#clickEventHandler(ev));
    }

    console.debug(`#${propName} has changed from "${oldValue}" to "${newValue}"`, ev);
  }

  #clickEventHandler (ev) {
    if (this.#createdFlag) { return; }

    const altFormElem = this.#queryCkBody('.ck-text-alternative-form');
    const labelElem = altFormElem.querySelector('.ck-form__header__label');
    console.assert(labelElem, 'Missing label element');

    const { button, dialog } = this.#createElements();

    labelElem.appendChild(button);
    document.body.appendChild(dialog);

    console.debug('Alt text form click (plugin):', altFormElem, labelElem);

    this.#createdFlag = true;
  }

  #createElements () {
    const button = document.createElement('button');
    const closeButton = document.createElement('button');
    const dialog = document.createElement('dialog');

    dialog.id = 'altTextHelpDialog';
    dialog.textContent = 'Some help and guidance on setting text alternatives for images...';

    closeButton.textContent = 'close';
    closeButton.setAttribute('command', 'close');
    closeButton.setAttribute('commandfor', 'altTextHelpDialog');

    button.textContent = 'Help';
    button.classList.add('alt-text-help-plugin-button');
    button.setAttribute('command', 'show-modal'); /** @BUG: Not working?! */
    button.setAttribute('commandfor', 'altTextHelpDialog');
    button.addEventListener('click', (ev) => {
      ev.preventDefault();
      dialog.showModal();
      // console.debug('inner click:', ev);
    });

    dialog.appendChild(closeButton);

    return { button, dialog, closeButton };
  }
}

async function delay (delayMS = 500) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), delayMS));
}

// mix(AltTextHelpPlugin, EmitterMixin);
