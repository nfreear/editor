
import { beep } from './beep.js';

export default {
  selector: '#live-editor', // Was :~ '#editor-form',
  timeout: 10 * 1000,
  sourceJs: './source.js',
  preDefinesJs: './pre-defines.js',
  pluginsRegex: /^(beep|[a-z]+)\(([^\)]+)\)/,
  pluginsCode: [],
  plugins: { beep },
  highlighter,
}

// Highlight.js :~ https://github.com/highlightjs/highlight.js#custom-initialization
function highlighter(editorElem) {
  if ('hljs' in window) {
    window.hljs.highlightBlock(editorElem)
    console.debug('Highlight.js run on:', editorElem)
  }
}
