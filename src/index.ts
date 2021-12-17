import {
	indentNodeProp,
	foldNodeProp,
	foldInside,
	LRLanguage,
	delimitedIndent,
} from "@codemirror/language"

import { styleTags, tags } from "@codemirror/highlight"

import { parser } from "lezer-circom"

const styleNodeProp = styleTags({
	"input output public include pragma circom main parallel": tags.keyword,
	"log assert": tags.macroName,
	"if else for while do return": tags.controlKeyword,
	"signal component var template function": tags.definitionKeyword,
	LineComment: tags.lineComment,
	BlockComment: tags.blockComment,
	CompilerVersion: tags.atom,
	Number: tags.number,
	String: tags.string,
	"OpenBrace CloseBrace": tags.brace,
	"OpenBracket CloseBracket": tags.bracket,
	"OpenParen CloseParen": tags.paren,
	"FunctionDeclaration/Identifier TemplateDeclaration/Identifier":
		tags.function(tags.variableName),
	"Call/Identifier": tags.function(tags.variableName),
	"InputSignalDeclaration/Identifier OutputSignalDeclaration/Identifier IntermediateSignalDeclaration/Identifier":
		tags.variableName,
	"ComponentDeclaration/Identifier VariableDeclaration/Identifier Assignment/Identifier":
		tags.variableName,
	"Value/Identifier": tags.variableName,
})

export const circomLanguage = LRLanguage.define({
	parser: parser.configure({
		props: [
			indentNodeProp.add({
				// IfStatement: continuedIndent({ except: /^\s*({|else\b)/ }),
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

			styleNodeProp,
		],
	}),
	languageData: {
		closeBrackets: { brackets: ["(", "[", "{", '"'] },
		commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
		indentOnInput: /^\s*\}$/,
	},
})
