import {
	indentNodeProp,
	foldNodeProp,
	foldInside,
	LRLanguage,
	delimitedIndent,
} from "@codemirror/language"

import { styleTags, tags } from "@codemirror/highlight"

import { parser } from "lezer-circom"

// CM6 has a very constrained vocabulary of tags
//   templates    -> tags.className
//   components   -> tags.typeName
//   variables    -> tags.variableName
//   signals      -> tags.propertyName
//   functions    -> tags.function(tags.variableName)
//   constraints  -> tags.compareOperator
// Call/Identifier, Assignment/Identifier, and Value/Identifier
// are all just tags.name for now.
const styleNodeProp = styleTags({
	"include pragma circom main": tags.keyword,
	"log assert": tags.operatorKeyword,
	"input output public parallel": tags.modifier,
	"if else for while do return": tags.controlKeyword,
	"signal component var template function": tags.definitionKeyword,
	LineComment: tags.lineComment,
	BlockComment: tags.blockComment,
	CompilerVersion: tags.literal,
	Number: tags.number,
	String: tags.string,

	// Syntax (none of these are style by default)
	"OpenBrace CloseBrace": tags.brace,
	"OpenBracket CloseBracket": tags.bracket,
	"OpenParen CloseParen": tags.paren,
	'";"': tags.punctuation,

	// Operators (none of these are style by default)
	'"&" "|" "~" "^" ">>" "<<"': tags.bitwiseOperator,
	'"+" "-" "*" "**" "/" "\\\\" "%"': tags.arithmeticOperator,
	'"&&" "||" "!" "<" "<=" ">" ">=" "==" "!=="': tags.logicOperator,
	'"===" "<==" "==>"': tags.compareOperator,

	"TemplateDeclaration/Identifier FunctionDeclaration/Identifier Call/Identifier":
		tags.function(tags.variableName),

	"InputSignalDeclaration/Identifier OutputSignalDeclaration/Identifier IntermediateSignalDeclaration/Identifier":
		tags.definition(tags.propertyName),
	"PublicSignalsList/Identifier": tags.definition(tags.propertyName),
	"Value/Signal/Identifier": tags.propertyName,

	"ComponentDeclaration/Identifier VariableDeclaration/Identifier Assignment/Identifier Value/Identifier":
		tags.variableName,
})

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

			styleNodeProp,
		],
	}),
	languageData: {
		closeBrackets: { brackets: ["(", "[", "{", '"'] },
		commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
		indentOnInput: /^\s*\}$/,
	},
})
