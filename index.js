import MyEditorElement from './src/MyEditorElement.js';
import AltTextHelpPlugin from './src/AltTextHelpPlugin.js';

const { customElements, location } = window;

function editorApp () {
  const editorElem = document.querySelector('my-editor');
  const params = new URLSearchParams(location.search);

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

  console.debug('version:', editorVersion());
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

export { editorApp, AltTextHelpPlugin, MyEditorElement };

export default MyEditorElement;
