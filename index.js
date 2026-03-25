import MyEditorElement from './src/MyEditorElement.js';
import MyEditoria11yElement from './src/editoria11y.js';
import AltTextHelpPlugin from './src/AltTextHelpPlugin.js';
import ImportContentElement from './src/ImportContentElement.js';

const { customElements, location } = window;

function editorApp () {
  const editorElem = document.querySelector('my-editor');
  const params = new URLSearchParams(location.search);

  document.documentElement.dataset.darkMode = !params.has('light-mode');

  if (params.has('highlight')) {
    document.body.classList.add('highlight');
  }

  if (params.has('default')) {
    editorElem.removeAttribute('toolbar');
  }

  if (params.has('lang-ui')) {
    editorElem.setAttribute('lang-ui', params.get('lang-ui'));
  }

  if (params.has('inspect')) {
    editorElem.setAttribute('inspect', true);
  }

  customElements.define('my-editor', MyEditorElement);
  customElements.define('my-editoria11y', MyEditoria11yElement); // For "test.html"!
  customElements.define('import-content', ImportContentElement); // For "test.html"!

  console.debug('editorApp completed OK.');
}

/** @DEPRECATED
 */
export function editorVersion () {
  const importMapElem = document.querySelector('script[ type = importmap ]');
  const importMap = JSON.parse(importMapElem.textContent);
  const editorPath = importMap.imports.ckeditor5;
  const match = editorPath.match(/@(.+?)\//);
  return match ? match[1] : null;
}

export { editorApp, AltTextHelpPlugin, MyEditorElement, ImportContentElement };

export default MyEditorElement;
