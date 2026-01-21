import { createToken, Lexer } from 'chevrotain'

// Keywords
export const Where = createToken({ name: 'Where', pattern: /where/i })
export const Project = createToken({ name: 'Project', pattern: /project/i })
export const Extend = createToken({ name: 'Extend', pattern: /extend/i })
export const Summarize = createToken({ name: 'Summarize', pattern: /summarize/i })
export const By = createToken({ name: 'By', pattern: /by/i })
export const Sort = createToken({ name: 'Sort', pattern: /sort/i })
export const Order = createToken({ name: 'Order', pattern: /order/i })
export const Top = createToken({ name: 'Top', pattern: /top/i })
export const Take = createToken({ name: 'Take', pattern: /take/i })
export const Limit = createToken({ name: 'Limit', pattern: /limit/i })
export const Distinct = createToken({ name: 'Distinct', pattern: /distinct/i })
export const Asc = createToken({ name: 'Asc', pattern: /asc/i })
export const Desc = createToken({ name: 'Desc', pattern: /desc/i })

// Logical operators
export const And = createToken({ name: 'And', pattern: /and/i })
export const Or = createToken({ name: 'Or', pattern: /or/i })
export const Not = createToken({ name: 'Not', pattern: /not/i })

// String operators
export const Contains = createToken({ name: 'Contains', pattern: /contains/i })
export const StartsWith = createToken({ name: 'StartsWith', pattern: /startswith/i })
export const EndsWith = createToken({ name: 'EndsWith', pattern: /endswith/i })

// Aggregation functions
export const Count = createToken({ name: 'Count', pattern: /count/i })
export const Sum = createToken({ name: 'Sum', pattern: /sum/i })
export const Avg = createToken({ name: 'Avg', pattern: /avg/i })
export const Min = createToken({ name: 'Min', pattern: /min/i })
export const Max = createToken({ name: 'Max', pattern: /max/i })
export const Dcount = createToken({ name: 'Dcount', pattern: /dcount/i })

// Boolean literals
export const True = createToken({ name: 'True', pattern: /true/i })
export const False = createToken({ name: 'False', pattern: /false/i })

// Comparison operators
export const Equals = createToken({ name: 'Equals', pattern: /==/ })
export const NotEquals = createToken({ name: 'NotEquals', pattern: /!=/ })
export const GreaterThanOrEqual = createToken({ name: 'GreaterThanOrEqual', pattern: />=/ })
export const LessThanOrEqual = createToken({ name: 'LessThanOrEqual', pattern: /<=/ })
export const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/ })
export const LessThan = createToken({ name: 'LessThan', pattern: /</ })

// Arithmetic operators
export const Plus = createToken({ name: 'Plus', pattern: /\+/ })
export const Minus = createToken({ name: 'Minus', pattern: /-/ })
export const Multiply = createToken({ name: 'Multiply', pattern: /\*/ })
export const Divide = createToken({ name: 'Divide', pattern: /\// })

// Symbols
export const Pipe = createToken({ name: 'Pipe', pattern: /\|/ })
export const Comma = createToken({ name: 'Comma', pattern: /,/ })
export const LParen = createToken({ name: 'LParen', pattern: /\(/ })
export const RParen = createToken({ name: 'RParen', pattern: /\)/ })
export const Assign = createToken({ name: 'Assign', pattern: /=/ })
export const Underscore = createToken({ name: 'Underscore', pattern: /_/ })

// Literals
export const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"[^"]*"|'[^']*'/
})
export const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /-?\d+(\.\d+)?/
})
export const DateTimeLiteral = createToken({
  name: 'DateTimeLiteral',
  pattern: /datetime\(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})?)?\)/i
})

// Identifier must come after keywords
export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/
})

// Whitespace (skipped)
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED
})

// Order matters! Keywords before Identifier, multi-char operators before single-char
export const allTokens = [
  WhiteSpace,
  // Multi-char operators first
  Equals,
  NotEquals,
  GreaterThanOrEqual,
  LessThanOrEqual,
  // Keywords (longer patterns first within keywords)
  DateTimeLiteral,
  StartsWith,
  EndsWith,
  Contains,
  Summarize,
  Distinct,
  Project,
  Extend,
  Where,
  Order,
  Limit,
  Count,
  Dcount,
  Sort,
  Take,
  Top,
  And,
  Or,
  Not,
  Sum,
  Avg,
  Min,
  Max,
  Asc,
  Desc,
  By,
  True,
  False,
  // Single-char operators
  GreaterThan,
  LessThan,
  Pipe,
  Comma,
  LParen,
  RParen,
  Assign,
  Plus,
  Minus,
  Multiply,
  Divide,
  Underscore,
  // Literals
  StringLiteral,
  NumberLiteral,
  // Identifier last
  Identifier
]

export const KqlLexer = new Lexer(allTokens)
