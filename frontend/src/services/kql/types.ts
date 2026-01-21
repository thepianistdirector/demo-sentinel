// KQL AST Types

export type KqlValue = string | number | boolean | null | Date

export interface KqlColumn {
  name: string
  alias?: string
}

export interface KqlExpression {
  type: 'column' | 'literal' | 'binary' | 'function' | 'unary'
}

export interface KqlColumnRef extends KqlExpression {
  type: 'column'
  name: string
}

export interface KqlLiteral extends KqlExpression {
  type: 'literal'
  value: KqlValue
  dataType: 'string' | 'number' | 'boolean' | 'datetime'
}

export interface KqlBinaryExpr extends KqlExpression {
  type: 'binary'
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startswith' | 'endswith' | 'and' | 'or' | '+' | '-' | '*' | '/'
  left: KqlExpr
  right: KqlExpr
}

export interface KqlUnaryExpr extends KqlExpression {
  type: 'unary'
  operator: 'not' | '-'
  operand: KqlExpr
}

export interface KqlFunctionCall extends KqlExpression {
  type: 'function'
  name: string
  args: KqlExpr[]
}

export type KqlExpr = KqlColumnRef | KqlLiteral | KqlBinaryExpr | KqlUnaryExpr | KqlFunctionCall

export interface KqlAggregation {
  func: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'dcount'
  column?: string
  alias?: string
}

// Operators
export interface KqlOperator {
  type: string
}

export interface KqlTableRef extends KqlOperator {
  type: 'table'
  name: string
}

export interface KqlWhereOp extends KqlOperator {
  type: 'where'
  predicate: KqlExpr
}

export interface KqlProjectOp extends KqlOperator {
  type: 'project'
  columns: Array<{ name: string; alias?: string; expr?: KqlExpr }>
}

export interface KqlExtendOp extends KqlOperator {
  type: 'extend'
  columns: Array<{ name: string; expr: KqlExpr }>
}

export interface KqlSummarizeOp extends KqlOperator {
  type: 'summarize'
  aggregations: KqlAggregation[]
  by?: string[]
}

export interface KqlSortOp extends KqlOperator {
  type: 'sort'
  columns: Array<{ name: string; desc: boolean }>
}

export interface KqlTopOp extends KqlOperator {
  type: 'top'
  count: number
  by?: { name: string; desc: boolean }
}

export interface KqlTakeOp extends KqlOperator {
  type: 'take'
  count: number
}

export interface KqlDistinctOp extends KqlOperator {
  type: 'distinct'
  columns?: string[]
}

export type KqlOp = KqlTableRef | KqlWhereOp | KqlProjectOp | KqlExtendOp | KqlSummarizeOp | KqlSortOp | KqlTopOp | KqlTakeOp | KqlDistinctOp

export interface KqlQuery {
  operators: KqlOp[]
}

export interface KqlResult {
  columns: string[]
  rows: Record<string, KqlValue>[]
  error?: string
}

export interface KqlParseError {
  message: string
  line: number
  column: number
}
