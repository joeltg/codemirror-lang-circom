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
	"input output public include pragma circom main parallel": tags.keyword,
	"log assert": tags.macroName,
	"if else for while do return": tags.controlKeyword,
	"signal component var template function": tags.definitionKeyword,
	LineComment: tags.lineComment,
	BlockComment: tags.blockComment,
	CompilerVersion: tags.atom,
	Number: tags.number,
	String: tags.string,

	// Syntax (none of these are style by default)
	"OpenBrace CloseBrace": tags.brace,
	"OpenBracket CloseBracket": tags.bracket,
	"OpenParen CloseParen": tags.paren,
	'";"': tags.punctuation,

	// Operators (none of these are style by default)
	'"&" "|" "~" "^" ">>" "<<"': tags.bitwiseOperator,
	'"+" "-" "*" "**" "/" "\\" "%"': tags.arithmeticOperator,
	'"&&" "||" "!" "<" "<=" ">" ">=" "==" "!=="': tags.logicOperator,
	'"===" "<==" "==>"': tags.compareOperator,

	// use tags.className for template names
	"TemplateDeclaration/Identifier": tags.definition(tags.className),

	// use tags.function(tags.variableName) for functions
	"FunctionDeclaration/Identifier": tags.definition(
		tags.function(tags.variableName)
	),

	// use tags.propertyName for signal names
	"InputSignalDeclaration/Identifier OutputSignalDeclaration/Identifier IntermediateSignalDeclaration/Identifier":
		tags.definition(tags.propertyName),
	"PublicSignalsList/Identifier": tags.definition(tags.propertyName),
	"Value/Signal/Identifier": tags.propertyName,

	// use tags.variableName for variables (we can only style the declaration)
	"VariableDeclaration/Identifier": tags.definition(tags.variableName),

	// use tags.typeName for components (we can only style the declaration)
	"ComponentDeclaration/Identifier": tags.definition(tags.typeName),

	// we can't distinguish between template and function calls,
	// or between component and variable assignments, or between
	// signal and variable values, so we leave them unstyled.
	"Call/Identifier Assignment/Identifier Value/Identifier": tags.name,
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
