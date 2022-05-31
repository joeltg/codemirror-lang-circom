import {
	indentNodeProp,
	foldNodeProp,
	foldInside,
	LRLanguage,
	delimitedIndent,
} from "@codemirror/language"

import { parser } from "lezer-circom"

export const circomLanguage = LRLanguage.define({
	parser: parser.configure({
		props: [
			indentNodeProp.add({
				"FunctionBody TemplateBody IfBody ElseBody ForLoopBody WhileLoopBody":
					delimitedIndent({ closing: "}" }),
			}),
			foldNodeProp.add({
				"FunctionBody TemplateBody IfBody ElseBody ForLoopBody WhileLoopBody":
					foldInside,
				BlockComment(tree) {
					return { from: tree.from + 2, to: tree.to - 2 }
				},
			}),
		],
	}),
	languageData: {
		closeBrackets: { brackets: ["(", "[", "{", '"'] },
		commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
		indentOnInput: /^\s*\}$/,
	},
})
