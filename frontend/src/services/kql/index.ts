import { KqlLexer } from './lexer'
import { kqlParser } from './parser'
import { kqlVisitor } from './visitor'
import { kqlExecutor, KqlExecutor } from './executor'
import type { KqlQuery, KqlResult, KqlParseError, KqlValue } from './types'

export type { KqlQuery, KqlResult, KqlParseError, KqlValue }

export interface KqlParseResult {
  success: boolean
  query?: KqlQuery
  error?: KqlParseError
}

/**
 * Parse a KQL query string into an AST
 */
export function parseKql(queryString: string): KqlParseResult {
  // Lexer
  const lexResult = KqlLexer.tokenize(queryString)
  if (lexResult.errors.length > 0) {
    const err = lexResult.errors[0]
    return {
      success: false,
      error: {
        message: err.message,
        line: err.line ?? 1,
        column: err.column ?? 1
      }
    }
  }

  // Parser
  kqlParser.input = lexResult.tokens
  const cst = kqlParser.query()

  if (kqlParser.errors.length > 0) {
    const err = kqlParser.errors[0]
    return {
      success: false,
      error: {
        message: err.message,
        line: err.token.startLine ?? 1,
        column: err.token.startColumn ?? 1
      }
    }
  }

  // Visitor - convert CST to AST
  const ast = kqlVisitor.visit(cst) as KqlQuery

  return { success: true, query: ast }
}

/**
 * Execute a KQL query against registered tables
 */
export function executeKql(queryString: string): KqlResult {
  const parseResult = parseKql(queryString)
  if (!parseResult.success || !parseResult.query) {
    return {
      columns: [],
      rows: [],
      error: parseResult.error?.message || 'Parse error'
    }
  }

  return kqlExecutor.execute(parseResult.query)
}

/**
 * Register a table for KQL queries
 */
export function registerTable(name: string, data: Record<string, KqlValue>[]): void {
  kqlExecutor.registerTable(name, data)
}

/**
 * Create a new executor instance (useful for isolated testing)
 */
export function createExecutor(): KqlExecutor {
  return new KqlExecutor()
}

// Re-export types
export * from './types'
