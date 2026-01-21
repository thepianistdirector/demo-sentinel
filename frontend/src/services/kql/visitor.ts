import type { CstNode, IToken } from 'chevrotain'
import { kqlParser } from './parser'
import type {
  KqlQuery,
  KqlOp,
  KqlExpr,
  KqlColumnRef,
  KqlLiteral,
  KqlBinaryExpr,
  KqlUnaryExpr,
  KqlFunctionCall,
  KqlAggregation
} from './types'

// Get the base visitor class
const BaseKqlVisitor = kqlParser.getBaseCstVisitorConstructor()

interface CstWithChildren extends CstNode {
  children: Record<string, (CstNode | IToken)[]>
}

class KqlCstVisitor extends BaseKqlVisitor {
  constructor() {
    super()
    this.validateVisitor()
  }

  query(ctx: CstWithChildren['children']): KqlQuery {
    const operators: KqlOp[] = []

    // Table reference
    if (ctx.tableRef) {
      const tableName = this.visit(ctx.tableRef[0] as CstNode) as string
      operators.push({ type: 'table', name: tableName })
    }

    // Operators
    if (ctx.operator) {
      for (const op of ctx.operator) {
        operators.push(this.visit(op as CstNode) as KqlOp)
      }
    }

    return { operators }
  }

  tableRef(ctx: CstWithChildren['children']): string {
    return (ctx.Identifier[0] as IToken).image
  }

  operator(ctx: CstWithChildren['children']): KqlOp {
    if (ctx.whereOp) return this.visit(ctx.whereOp[0] as CstNode) as KqlOp
    if (ctx.projectOp) return this.visit(ctx.projectOp[0] as CstNode) as KqlOp
    if (ctx.extendOp) return this.visit(ctx.extendOp[0] as CstNode) as KqlOp
    if (ctx.summarizeOp) return this.visit(ctx.summarizeOp[0] as CstNode) as KqlOp
    if (ctx.sortOp) return this.visit(ctx.sortOp[0] as CstNode) as KqlOp
    if (ctx.topOp) return this.visit(ctx.topOp[0] as CstNode) as KqlOp
    if (ctx.takeOp) return this.visit(ctx.takeOp[0] as CstNode) as KqlOp
    if (ctx.distinctOp) return this.visit(ctx.distinctOp[0] as CstNode) as KqlOp
    throw new Error('Unknown operator')
  }

  whereOp(ctx: CstWithChildren['children']): KqlOp {
    return {
      type: 'where',
      predicate: this.visit(ctx.expression[0] as CstNode) as KqlExpr
    }
  }

  projectOp(ctx: CstWithChildren['children']): KqlOp {
    const columns = this.visit(ctx.columnList[0] as CstNode) as Array<{ name: string; alias?: string; expr?: KqlExpr }>
    return { type: 'project', columns }
  }

  extendOp(ctx: CstWithChildren['children']): KqlOp {
    const columns = this.visit(ctx.assignmentList[0] as CstNode) as Array<{ name: string; expr: KqlExpr }>
    return { type: 'extend', columns }
  }

  summarizeOp(ctx: CstWithChildren['children']): KqlOp {
    const aggregations = this.visit(ctx.aggregationList[0] as CstNode) as KqlAggregation[]
    let by: string[] | undefined
    if (ctx.identifierList) {
      by = this.visit(ctx.identifierList[0] as CstNode) as string[]
    }
    return { type: 'summarize', aggregations, by }
  }

  sortOp(ctx: CstWithChildren['children']): KqlOp {
    const columns = this.visit(ctx.sortColumnList[0] as CstNode) as Array<{ name: string; desc: boolean }>
    return { type: 'sort', columns }
  }

  topOp(ctx: CstWithChildren['children']): KqlOp {
    const count = parseInt((ctx.NumberLiteral[0] as IToken).image, 10)
    let by: { name: string; desc: boolean } | undefined
    if (ctx.Identifier) {
      const name = (ctx.Identifier[0] as IToken).image
      const desc = ctx.Desc ? true : !ctx.Asc
      by = { name, desc }
    }
    return { type: 'top', count, by }
  }

  takeOp(ctx: CstWithChildren['children']): KqlOp {
    const count = parseInt((ctx.NumberLiteral[0] as IToken).image, 10)
    return { type: 'take', count }
  }

  distinctOp(ctx: CstWithChildren['children']): KqlOp {
    let columns: string[] | undefined
    if (ctx.identifierList) {
      columns = this.visit(ctx.identifierList[0] as CstNode) as string[]
    }
    return { type: 'distinct', columns }
  }

  // Expression visitors
  expression(ctx: CstWithChildren['children']): KqlExpr {
    return this.visit(ctx.orExpression[0] as CstNode) as KqlExpr
  }

  orExpression(ctx: CstWithChildren['children']): KqlExpr {
    let result = this.visit(ctx.andExpression[0] as CstNode) as KqlExpr
    if (ctx.andExpression.length > 1) {
      for (let i = 1; i < ctx.andExpression.length; i++) {
        const right = this.visit(ctx.andExpression[i] as CstNode) as KqlExpr
        result = { type: 'binary', operator: 'or', left: result, right } as KqlBinaryExpr
      }
    }
    return result
  }

  andExpression(ctx: CstWithChildren['children']): KqlExpr {
    let result = this.visit(ctx.notExpression[0] as CstNode) as KqlExpr
    if (ctx.notExpression.length > 1) {
      for (let i = 1; i < ctx.notExpression.length; i++) {
        const right = this.visit(ctx.notExpression[i] as CstNode) as KqlExpr
        result = { type: 'binary', operator: 'and', left: result, right } as KqlBinaryExpr
      }
    }
    return result
  }

  notExpression(ctx: CstWithChildren['children']): KqlExpr {
    const expr = this.visit(ctx.comparisonExpression[0] as CstNode) as KqlExpr
    if (ctx.Not) {
      return { type: 'unary', operator: 'not', operand: expr } as KqlUnaryExpr
    }
    return expr
  }

  comparisonExpression(ctx: CstWithChildren['children']): KqlExpr {
    const left = this.visit(ctx.additiveExpression[0] as CstNode) as KqlExpr
    if (ctx.additiveExpression.length > 1) {
      const right = this.visit(ctx.additiveExpression[1] as CstNode) as KqlExpr
      let operator: KqlBinaryExpr['operator']
      if (ctx.Equals) operator = '=='
      else if (ctx.NotEquals) operator = '!='
      else if (ctx.GreaterThan) operator = '>'
      else if (ctx.LessThan) operator = '<'
      else if (ctx.GreaterThanOrEqual) operator = '>='
      else if (ctx.LessThanOrEqual) operator = '<='
      else if (ctx.Contains) operator = 'contains'
      else if (ctx.StartsWith) operator = 'startswith'
      else if (ctx.EndsWith) operator = 'endswith'
      else throw new Error('Unknown comparison operator')
      return { type: 'binary', operator, left, right } as KqlBinaryExpr
    }
    return left
  }

  additiveExpression(ctx: CstWithChildren['children']): KqlExpr {
    let result = this.visit(ctx.multiplicativeExpression[0] as CstNode) as KqlExpr
    if (ctx.multiplicativeExpression.length > 1) {
      for (let i = 1; i < ctx.multiplicativeExpression.length; i++) {
        const right = this.visit(ctx.multiplicativeExpression[i] as CstNode) as KqlExpr
        const operator = ctx.Plus && ctx.Plus[i - 1] ? '+' : '-'
        result = { type: 'binary', operator, left: result, right } as KqlBinaryExpr
      }
    }
    return result
  }

  multiplicativeExpression(ctx: CstWithChildren['children']): KqlExpr {
    let result = this.visit(ctx.primaryExpression[0] as CstNode) as KqlExpr
    if (ctx.primaryExpression.length > 1) {
      for (let i = 1; i < ctx.primaryExpression.length; i++) {
        const right = this.visit(ctx.primaryExpression[i] as CstNode) as KqlExpr
        const operator = ctx.Multiply && ctx.Multiply[i - 1] ? '*' : '/'
        result = { type: 'binary', operator, left: result, right } as KqlBinaryExpr
      }
    }
    return result
  }

  primaryExpression(ctx: CstWithChildren['children']): KqlExpr {
    if (ctx.functionCall) return this.visit(ctx.functionCall[0] as CstNode) as KqlExpr
    if (ctx.literal) return this.visit(ctx.literal[0] as CstNode) as KqlExpr
    if (ctx.Identifier) return { type: 'column', name: (ctx.Identifier[0] as IToken).image } as KqlColumnRef
    if (ctx.parenExpression) return this.visit(ctx.parenExpression[0] as CstNode) as KqlExpr
    throw new Error('Unknown primary expression')
  }

  parenExpression(ctx: CstWithChildren['children']): KqlExpr {
    return this.visit(ctx.expression[0] as CstNode) as KqlExpr
  }

  functionCall(ctx: CstWithChildren['children']): KqlFunctionCall {
    let name: string
    if (ctx.Count) name = 'count'
    else if (ctx.Sum) name = 'sum'
    else if (ctx.Avg) name = 'avg'
    else if (ctx.Min) name = 'min'
    else if (ctx.Max) name = 'max'
    else if (ctx.Dcount) name = 'dcount'
    else throw new Error('Unknown function')

    const args: KqlExpr[] = []
    if (ctx.expressionList) {
      const exprList = this.visit(ctx.expressionList[0] as CstNode) as KqlExpr[]
      args.push(...exprList)
    }

    return { type: 'function', name, args }
  }

  literal(ctx: CstWithChildren['children']): KqlLiteral {
    if (ctx.StringLiteral) {
      const raw = (ctx.StringLiteral[0] as IToken).image
      return { type: 'literal', value: raw.slice(1, -1), dataType: 'string' }
    }
    if (ctx.NumberLiteral) {
      const raw = (ctx.NumberLiteral[0] as IToken).image
      return { type: 'literal', value: parseFloat(raw), dataType: 'number' }
    }
    if (ctx.DateTimeLiteral) {
      const raw = (ctx.DateTimeLiteral[0] as IToken).image
      const dateStr = raw.replace(/^datetime\(/i, '').replace(/\)$/, '')
      return { type: 'literal', value: new Date(dateStr), dataType: 'datetime' }
    }
    if (ctx.True) {
      return { type: 'literal', value: true, dataType: 'boolean' }
    }
    if (ctx.False) {
      return { type: 'literal', value: false, dataType: 'boolean' }
    }
    throw new Error('Unknown literal')
  }

  // List visitors
  columnList(ctx: CstWithChildren['children']): Array<{ name: string; alias?: string; expr?: KqlExpr }> {
    return ctx.columnSpec.map(spec => this.visit(spec as CstNode) as { name: string; alias?: string; expr?: KqlExpr })
  }

  columnSpec(ctx: CstWithChildren['children']): { name: string; alias?: string; expr?: KqlExpr } {
    const name = (ctx.Identifier[0] as IToken).image
    if (ctx.expression) {
      return { name, alias: name, expr: this.visit(ctx.expression[0] as CstNode) as KqlExpr }
    }
    return { name }
  }

  assignmentList(ctx: CstWithChildren['children']): Array<{ name: string; expr: KqlExpr }> {
    return ctx.assignment.map(a => this.visit(a as CstNode) as { name: string; expr: KqlExpr })
  }

  assignment(ctx: CstWithChildren['children']): { name: string; expr: KqlExpr } {
    return {
      name: (ctx.Identifier[0] as IToken).image,
      expr: this.visit(ctx.expression[0] as CstNode) as KqlExpr
    }
  }

  aggregationList(ctx: CstWithChildren['children']): KqlAggregation[] {
    return ctx.aggregationSpec.map(spec => this.visit(spec as CstNode) as KqlAggregation)
  }

  aggregationSpec(ctx: CstWithChildren['children']): KqlAggregation {
    const funcCall = this.visit(ctx.functionCall[0] as CstNode) as KqlFunctionCall
    const func = funcCall.name as KqlAggregation['func']
    const column = funcCall.args.length > 0 && funcCall.args[0].type === 'column'
      ? (funcCall.args[0] as KqlColumnRef).name
      : undefined
    const alias = ctx.Identifier ? (ctx.Identifier[0] as IToken).image : undefined
    return { func, column, alias }
  }

  identifierList(ctx: CstWithChildren['children']): string[] {
    return (ctx.Identifier as IToken[]).map(id => id.image)
  }

  sortColumnList(ctx: CstWithChildren['children']): Array<{ name: string; desc: boolean }> {
    return ctx.sortColumn.map(col => this.visit(col as CstNode) as { name: string; desc: boolean })
  }

  sortColumn(ctx: CstWithChildren['children']): { name: string; desc: boolean } {
    return {
      name: (ctx.Identifier[0] as IToken).image,
      desc: ctx.Desc ? true : false
    }
  }

  expressionList(ctx: CstWithChildren['children']): KqlExpr[] {
    return ctx.expression.map(e => this.visit(e as CstNode) as KqlExpr)
  }
}

export const kqlVisitor = new KqlCstVisitor()
