import MyEditorElement from './src/MyEditorElement.js';

export function editorApp () {
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

  customElements.define('my-editor', MyEditorElement);

  console.debug('version:', editorVersion());
}

export function editorVersion () {
  const importMapElem = document.querySelector('script[ type = importmap ]');
  const importMap = JSON.parse(importMapElem.textContent);
  const editorPath = importMap.imports.ckeditor5;
  const match = editorPath.match(/@(.+?)\//);
  return match ? match[1] : null;
}

export default MyEditorElement;
