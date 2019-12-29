
import { beep } from './beep.js';
import { highlight } from './highlight.js';

export default {
  selector: '#live-editor', // Was :~ '#editor-form',
  timeout: 10 * 1000,
  sourceJs: './source.js',
  preDefinesJs: './pre-defines.js',
  pluginsRegex: /^fn:(beep|[a-z]+)\(([^\)]+)\)/,
  pluginsCode: [],
  plugins: { beep },
  callbacks: { highlight, start: () => {} },
  highlightTimeout: 300,
}
