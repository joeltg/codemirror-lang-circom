# codemirror-lang-circom

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme) [![license](https://img.shields.io/github/license/joeltg/codemirror-lang-circom)](https://opensource.org/licenses/GPL-3.0) [![NPM version](https://img.shields.io/npm/v/codemirror-lang-circom)](https://www.npmjs.com/package/codemirror-lang-circom) ![TypeScript types](https://img.shields.io/npm/types/codemirror-lang-circom)

A Codemirror language extension for circom.

> ⚠️ This extension is very rough alpha-quality! There are almost certainly bugs.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Install

```
npm i codemirror-lang-circom
```

## Usage

```ts
import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

import { circomLanguage } from "codemirror-lang-circom"

import { basicSetup } from "@codemirror/basic-setup"
import { defaultHighlightStyle } from "@codemirror/highlight"
import { keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"

const view = new EditorView({
	state: EditorState.create({
		extensions: [
			circomLanguage,
			basicSetup,
			defaultHighlightStyle,
			keymap.of(defaultKeymap),
		],
	}),
	parent: document.querySelector("#editor"),
})
```

You can find documentation for the LR parser interface [on the Lezer website](https://lezer.codemirror.net/docs/ref/).

## API

```ts
import type { LRLanguage } from "@codemirror/language"

export const circomLanguage: LRLanguage
```

## Contributing

This is still under active development so I'm probably not interested in issues or PRs until it stabilizes a little.

## License

GPLv3 © 2021 Joel Gustafson
