
[![pipeline status][ci-badge]][ci-link]

# live-editor

A simple live-coding Javascript editor, built on a Web Worker.

 * [nfreear.gitlab.io/live-editor][demo]
 * [GitHub: nfreear/live-editor][git]

## Usage

### Basic usage

```html
<form id="live-editor">

  <pre class="editor" contenteditable="true"></pre>

  <button> Play </button>

  <pre class="log"></pre>

</form>

<script type="module" src="../index.js" data-live-editor="autoload"></script>
```

### Advanced usage

```html
<form id="live-editor">
  ...
</form>

<script type="module">

  import { LiveEditor, beep } from 'https://nfreear.gitlab.io/live-editor/index.js';

  const editor = new LiveEditor({
    plugins: {
      beep,
      test: param => console.warn('TEST:', param),
    }
  })
  editor.run()

</script>
```

## Install

```
git clone https://github.com/nfreear/live-editor.git
npm install
npm start
```

## Links

  - Initial :~ https://gist.github.com/nfreear/307dfbd47c5b64d21cd0265185535de8
  - Inspiration :~ http://blog.namangoel.com/replacing-eval-with-a-web-worker
  - Ideas! :~ https://odino.org/emit-a-beeping-sound-with-javascript/
  - Syntax highlighting :~ https://prismjs.com

## License

  - MIT :~ <https://nfreear.mit-license.org>
  - Nick Freear & contributors. With ❤️

---

[demo]: https://nfreear.gitlab.io/live-editor/demo/
[git]:  https://github.com/nfreear/live-editor
[ci-badge]: https://gitlab.com/nfreear/live-editor/badges/master/pipeline.svg
[ci-link]: https://gitlab.com/nfreear/live-editor#!/commits/master "CI status on GitLab"
