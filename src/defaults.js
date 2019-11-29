
import * as beep from './beep.js';

export default {
  selector: '#editor-form',
  timeout: 10 * 1000,
  sourceJs: './source.js',
  preDefinesJs: './pre-defines.js',
  pluginsRegex: /^(beep)\((\d*)\)/,
  plugins: { beep },
}
