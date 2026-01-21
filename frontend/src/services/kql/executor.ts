import type {
  KqlQuery,
  KqlExpr,
  KqlValue,
  KqlResult,
  KqlWhereOp,
  KqlProjectOp,
  KqlExtendOp,
  KqlSummarizeOp,
  KqlSortOp,
  KqlTopOp,
  KqlTakeOp,
  KqlDistinctOp,
  KqlAggregation,
  KqlColumnRef,
  KqlLiteral,
  KqlBinaryExpr,
  KqlUnaryExpr,
  KqlFunctionCall
} from './types'

type Row = Record<string, KqlValue>

export class KqlExecutor {
  private tables: Map<string, Row[]>

  constructor() {
    this.tables = new Map()
  }

  registerTable(name: string, data: Row[]): void {
    this.tables.set(name.toLowerCase(), data)
  }

  execute(query: KqlQuery): KqlResult {
    try {
      let rows: Row[] = []
      let columns: string[] = []

      for (const op of query.operators) {
        switch (op.type) {
          case 'table':
            const tableData = this.tables.get(op.name.toLowerCase())
            if (!tableData) {
              return { columns: [], rows: [], error: `Table '${op.name}' not found` }
            }
            rows = [...tableData]
            columns = rows.length > 0 ? Object.keys(rows[0]) : []
            break
          case 'where':
            rows = this.executeWhere(rows, op as KqlWhereOp)
            break
          case 'project':
            const result = this.executeProject(rows, op as KqlProjectOp)
            rows = result.rows
            columns = result.columns
            break
          case 'extend':
            rows = this.executeExtend(rows, op as KqlExtendOp)
            columns = rows.length > 0 ? Object.keys(rows[0]) : columns
            break
          case 'summarize':
            const sumResult = this.executeSummarize(rows, op as KqlSummarizeOp)
            rows = sumResult.rows
            columns = sumResult.columns
            break
          case 'sort':
            rows = this.executeSort(rows, op as KqlSortOp)
            break
          case 'top':
            rows = this.executeTop(rows, op as KqlTopOp)
            break
          case 'take':
            rows = this.executeTake(rows, op as KqlTakeOp)
            break
          case 'distinct':
            const distResult = this.executeDistinct(rows, columns, op as KqlDistinctOp)
            rows = distResult.rows
            columns = distResult.columns
            break
        }
      }

      return { columns, rows }
    } catch (error) {
      return {
        columns: [],
        rows: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private executeWhere(rows: Row[], op: KqlWhereOp): Row[] {
    return rows.filter(row => this.evaluatePredicate(row, op.predicate))
  }

  private executeProject(rows: Row[], op: KqlProjectOp): { rows: Row[]; columns: string[] } {
    const columns = op.columns.map(c => c.alias || c.name)
    const newRows = rows.map(row => {
      const newRow: Row = {}
      for (const col of op.columns) {
        const name = col.alias || col.name
        if (col.expr) {
          newRow[name] = this.evaluateExpr(row, col.expr)
        } else {
          newRow[name] = row[col.name]
        }
      }
      return newRow
    })
    return { rows: newRows, columns }
  }

  private executeExtend(rows: Row[], op: KqlExtendOp): Row[] {
    return rows.map(row => {
      const newRow = { ...row }
      for (const col of op.columns) {
        newRow[col.name] = this.evaluateExpr(row, col.expr)
      }
      return newRow
    })
  }

  private executeSummarize(rows: Row[], op: KqlSummarizeOp): { rows: Row[]; columns: string[] } {
    const groups = new Map<string, Row[]>()

    if (op.by && op.by.length > 0) {
      // Group by columns
      for (const row of rows) {
        const key = op.by.map(col => String(row[col] ?? '')).join('|')
        if (!groups.has(key)) {
          groups.set(key, [])
        }
        groups.get(key)!.push(row)
      }
    } else {
      // Single group for all rows
      groups.set('', rows)
    }

    const resultRows: Row[] = []
    for (const [, groupRows] of groups) {
      const newRow: Row = {}

      // Add group by columns
      if (op.by && groupRows.length > 0) {
        for (const col of op.by) {
          newRow[col] = groupRows[0][col]
        }
      }

      // Add aggregations
      for (const agg of op.aggregations) {
        const value = this.computeAggregation(groupRows, agg)
        const name = agg.alias || `${agg.func}_${agg.column || ''}`
        newRow[name] = value
      }

      resultRows.push(newRow)
    }

    const columns = [
      ...(op.by || []),
      ...op.aggregations.map(a => a.alias || `${a.func}_${a.column || ''}`)
    ]

    return { rows: resultRows, columns }
  }

  private executeSort(rows: Row[], op: KqlSortOp): Row[] {
    return [...rows].sort((a, b) => {
      for (const col of op.columns) {
        const aVal = a[col.name]
        const bVal = b[col.name]
        let cmp = 0

        if (aVal === bVal) continue
        if (aVal === null || aVal === undefined) cmp = 1
        else if (bVal === null || bVal === undefined) cmp = -1
        else if (typeof aVal === 'number' && typeof bVal === 'number') {
          cmp = aVal - bVal
        } else {
          cmp = String(aVal).localeCompare(String(bVal))
        }

        if (col.desc) cmp = -cmp
        if (cmp !== 0) return cmp
      }
      return 0
    })
  }

  private executeTop(rows: Row[], op: KqlTopOp): Row[] {
    if (op.by) {
      const sorted = [...rows].sort((a, b) => {
        const aVal = a[op.by!.name]
        const bVal = b[op.by!.name]
        let cmp = 0

        if (aVal === bVal) cmp = 0
        else if (aVal === null || aVal === undefined) cmp = 1
        else if (bVal === null || bVal === undefined) cmp = -1
        else if (typeof aVal === 'number' && typeof bVal === 'number') {
          cmp = aVal - bVal
        } else {
          cmp = String(aVal).localeCompare(String(bVal))
        }

        return op.by!.desc ? -cmp : cmp
      })
      return sorted.slice(0, op.count)
    }
    return rows.slice(0, op.count)
  }

  private executeTake(rows: Row[], op: KqlTakeOp): Row[] {
    return rows.slice(0, op.count)
  }

  private executeDistinct(rows: Row[], columns: string[], op: KqlDistinctOp): { rows: Row[]; columns: string[] } {
    const distinctCols = op.columns || columns
    const seen = new Set<string>()
    const result: Row[] = []

    for (const row of rows) {
      const key = distinctCols.map(col => String(row[col] ?? '')).join('|')
      if (!seen.has(key)) {
        seen.add(key)
        if (op.columns) {
          const newRow: Row = {}
          for (const col of op.columns) {
            newRow[col] = row[col]
          }
          result.push(newRow)
        } else {
          result.push(row)
        }
      }
    }

    return { rows: result, columns: op.columns || columns }
  }

  private computeAggregation(rows: Row[], agg: KqlAggregation): KqlValue {
    switch (agg.func) {
      case 'count':
        return rows.length
      case 'dcount':
        if (!agg.column) return rows.length
        const distinctValues = new Set(rows.map(r => r[agg.column!]))
        return distinctValues.size
      case 'sum':
        if (!agg.column) return 0
        return rows.reduce((sum, r) => {
          const val = r[agg.column!]
          return sum + (typeof val === 'number' ? val : 0)
        }, 0)
      case 'avg':
        if (!agg.column || rows.length === 0) return 0
        const total = rows.reduce((sum, r) => {
          const val = r[agg.column!]
          return sum + (typeof val === 'number' ? val : 0)
        }, 0)
        return total / rows.length
      case 'min':
        if (!agg.column || rows.length === 0) return null
        return rows.reduce((min, r) => {
          const val = r[agg.column!]
          if (min === null) return val
          if (val === null || val === undefined) return min
          return val < min ? val : min
        }, null as KqlValue)
      case 'max':
        if (!agg.column || rows.length === 0) return null
        return rows.reduce((max, r) => {
          const val = r[agg.column!]
          if (max === null) return val
          if (val === null || val === undefined) return max
          return val > max ? val : max
        }, null as KqlValue)
      default:
        return null
    }
  }

  private evaluatePredicate(row: Row, expr: KqlExpr): boolean {
    const result = this.evaluateExpr(row, expr)
    return Boolean(result)
  }

  private evaluateExpr(row: Row, expr: KqlExpr): KqlValue {
    switch (expr.type) {
      case 'column':
        return row[(expr as KqlColumnRef).name] ?? null
      case 'literal':
        return (expr as KqlLiteral).value
      case 'binary':
        return this.evaluateBinary(row, expr as KqlBinaryExpr)
      case 'unary':
        return this.evaluateUnary(row, expr as KqlUnaryExpr)
      case 'function':
        return this.evaluateFunction(row, expr as KqlFunctionCall)
      default:
        return null
    }
  }

  private evaluateBinary(row: Row, expr: KqlBinaryExpr): KqlValue {
    const left = this.evaluateExpr(row, expr.left)
    const right = this.evaluateExpr(row, expr.right)

    switch (expr.operator) {
      case '==':
        return left === right
      case '!=':
        return left !== right
      case '>':
        if (typeof left === 'number' && typeof right === 'number') return left > right
        return String(left) > String(right)
      case '<':
        if (typeof left === 'number' && typeof right === 'number') return left < right
        return String(left) < String(right)
      case '>=':
        if (typeof left === 'number' && typeof right === 'number') return left >= right
        return String(left) >= String(right)
      case '<=':
        if (typeof left === 'number' && typeof right === 'number') return left <= right
        return String(left) <= String(right)
      case 'contains':
        return String(left).toLowerCase().includes(String(right).toLowerCase())
      case 'startswith':
        return String(left).toLowerCase().startsWith(String(right).toLowerCase())
      case 'endswith':
        return String(left).toLowerCase().endsWith(String(right).toLowerCase())
      case 'and':
        return Boolean(left) && Boolean(right)
      case 'or':
        return Boolean(left) || Boolean(right)
      case '+':
        if (typeof left === 'number' && typeof right === 'number') return left + right
        return String(left) + String(right)
      case '-':
        if (typeof left === 'number' && typeof right === 'number') return left - right
        return null
      case '*':
        if (typeof left === 'number' && typeof right === 'number') return left * right
        return null
      case '/':
        if (typeof left === 'number' && typeof right === 'number' && right !== 0) return left / right
        return null
      default:
        return null
    }
  }

  private evaluateUnary(row: Row, expr: KqlUnaryExpr): KqlValue {
    const operand = this.evaluateExpr(row, expr.operand)
    switch (expr.operator) {
      case 'not':
        return !operand
      case '-':
        return typeof operand === 'number' ? -operand : null
      default:
        return null
    }
  }

  private evaluateFunction(_row: Row, expr: KqlFunctionCall): KqlValue {
    // These are typically used in aggregation context, not per-row
    // Return placeholder for now
    switch (expr.name) {
      case 'count':
      case 'sum':
      case 'avg':
      case 'min':
      case 'max':
      case 'dcount':
        return 0 // Aggregations handled separately
      default:
        return null
    }
  }
}

export const kqlExecutor = new KqlExecutor()
