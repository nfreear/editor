
import { beep } from './beep.js';

export default {
  selector: '#live-editor', // Was :~ '#editor-form',
  timeout: 10 * 1000,
  sourceJs: './source.js',
  preDefinesJs: './pre-defines.js',
  pluginsRegex: /^fn:(beep|[a-z]+)\(([^\)]+)\)/,
  pluginsCode: [],
  plugins: { beep },
  callbacks: { highlight, start: () => {} },
}

// --------------------------------------------------------

function highlight(editorElem) {
  // Prism js :~ https://prismjs.com/extending.html#highlight-element
  if ('Prism' in window) {
    window.Prism.highlightElement(editorElem)
    console.debug('Prism run on:', editorElem)
  }

  // Highlight.js :~ https://github.com/highlightjs/highlight.js#custom-initialization
  if ('hljs' in window) {
    window.hljs.highlightBlock(editorElem)
    console.debug('Highlight.js run on:', editorElem)
  }
}
