import { CstParser } from 'chevrotain'
import {
  allTokens,
  Where,
  Project,
  Extend,
  Summarize,
  By,
  Sort,
  Order,
  Top,
  Take,
  Limit,
  Distinct,
  Asc,
  Desc,
  And,
  Or,
  Not,
  Contains,
  StartsWith,
  EndsWith,
  Count,
  Sum,
  Avg,
  Min,
  Max,
  Dcount,
  True,
  False,
  Equals,
  NotEquals,
  GreaterThan,
  LessThan,
  GreaterThanOrEqual,
  LessThanOrEqual,
  Plus,
  Minus,
  Multiply,
  Divide,
  Pipe,
  Comma,
  LParen,
  RParen,
  Assign,
  StringLiteral,
  NumberLiteral,
  DateTimeLiteral,
  Identifier
} from './lexer'

export class KqlParser extends CstParser {
  constructor() {
    super(allTokens)
    this.performSelfAnalysis()
  }

  // Entry point: tableName | operator | operator ...
  public query = this.RULE('query', () => {
    this.SUBRULE(this.tableRef)
    this.MANY(() => {
      this.CONSUME(Pipe)
      this.SUBRULE(this.operator)
    })
  })

  private tableRef = this.RULE('tableRef', () => {
    this.CONSUME(Identifier)
  })

  private operator = this.RULE('operator', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.whereOp) },
      { ALT: () => this.SUBRULE(this.projectOp) },
      { ALT: () => this.SUBRULE(this.extendOp) },
      { ALT: () => this.SUBRULE(this.summarizeOp) },
      { ALT: () => this.SUBRULE(this.sortOp) },
      { ALT: () => this.SUBRULE(this.topOp) },
      { ALT: () => this.SUBRULE(this.takeOp) },
      { ALT: () => this.SUBRULE(this.distinctOp) }
    ])
  })

  private whereOp = this.RULE('whereOp', () => {
    this.CONSUME(Where)
    this.SUBRULE(this.expression)
  })

  private projectOp = this.RULE('projectOp', () => {
    this.CONSUME(Project)
    this.SUBRULE(this.columnList)
  })

  private extendOp = this.RULE('extendOp', () => {
    this.CONSUME(Extend)
    this.SUBRULE(this.assignmentList)
  })

  private summarizeOp = this.RULE('summarizeOp', () => {
    this.CONSUME(Summarize)
    this.SUBRULE(this.aggregationList)
    this.OPTION(() => {
      this.CONSUME(By)
      this.SUBRULE(this.identifierList)
    })
  })

  private sortOp = this.RULE('sortOp', () => {
    this.OR([
      { ALT: () => this.CONSUME(Sort) },
      { ALT: () => { this.CONSUME(Order); this.CONSUME(By) } }
    ])
    this.SUBRULE(this.sortColumnList)
  })

  private topOp = this.RULE('topOp', () => {
    this.CONSUME(Top)
    this.CONSUME(NumberLiteral)
    this.OPTION(() => {
      this.CONSUME(By)
      this.CONSUME(Identifier)
      this.OPTION2(() => {
        this.OR2([
          { ALT: () => this.CONSUME(Asc) },
          { ALT: () => this.CONSUME(Desc) }
        ])
      })
    })
  })

  private takeOp = this.RULE('takeOp', () => {
    this.OR([
      { ALT: () => this.CONSUME(Take) },
      { ALT: () => this.CONSUME(Limit) }
    ])
    this.CONSUME(NumberLiteral)
  })

  private distinctOp = this.RULE('distinctOp', () => {
    this.CONSUME(Distinct)
    this.OPTION(() => {
      this.SUBRULE(this.identifierList)
    })
  })

  // Expression hierarchy for operator precedence
  private expression = this.RULE('expression', () => {
    this.SUBRULE(this.orExpression)
  })

  private orExpression = this.RULE('orExpression', () => {
    this.SUBRULE(this.andExpression)
    this.MANY(() => {
      this.CONSUME(Or)
      this.SUBRULE2(this.andExpression)
    })
  })

  private andExpression = this.RULE('andExpression', () => {
    this.SUBRULE(this.notExpression)
    this.MANY(() => {
      this.CONSUME(And)
      this.SUBRULE2(this.notExpression)
    })
  })

  private notExpression = this.RULE('notExpression', () => {
    this.OPTION(() => {
      this.CONSUME(Not)
    })
    this.SUBRULE(this.comparisonExpression)
  })

  private comparisonExpression = this.RULE('comparisonExpression', () => {
    this.SUBRULE(this.additiveExpression)
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(Equals) },
        { ALT: () => this.CONSUME(NotEquals) },
        { ALT: () => this.CONSUME(GreaterThan) },
        { ALT: () => this.CONSUME(LessThan) },
        { ALT: () => this.CONSUME(GreaterThanOrEqual) },
        { ALT: () => this.CONSUME(LessThanOrEqual) },
        { ALT: () => this.CONSUME(Contains) },
        { ALT: () => this.CONSUME(StartsWith) },
        { ALT: () => this.CONSUME(EndsWith) }
      ])
      this.SUBRULE2(this.additiveExpression)
    })
  })

  private additiveExpression = this.RULE('additiveExpression', () => {
    this.SUBRULE(this.multiplicativeExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Plus) },
        { ALT: () => this.CONSUME(Minus) }
      ])
      this.SUBRULE2(this.multiplicativeExpression)
    })
  })

  private multiplicativeExpression = this.RULE('multiplicativeExpression', () => {
    this.SUBRULE(this.primaryExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Multiply) },
        { ALT: () => this.CONSUME(Divide) }
      ])
      this.SUBRULE2(this.primaryExpression)
    })
  })

  private primaryExpression = this.RULE('primaryExpression', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.functionCall) },
      { ALT: () => this.SUBRULE(this.literal) },
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.SUBRULE(this.parenExpression) }
    ])
  })

  private parenExpression = this.RULE('parenExpression', () => {
    this.CONSUME(LParen)
    this.SUBRULE(this.expression)
    this.CONSUME(RParen)
  })

  private functionCall = this.RULE('functionCall', () => {
    this.OR([
      { ALT: () => this.CONSUME(Count) },
      { ALT: () => this.CONSUME(Sum) },
      { ALT: () => this.CONSUME(Avg) },
      { ALT: () => this.CONSUME(Min) },
      { ALT: () => this.CONSUME(Max) },
      { ALT: () => this.CONSUME(Dcount) }
    ])
    this.CONSUME(LParen)
    this.OPTION(() => {
      this.SUBRULE(this.expressionList)
    })
    this.CONSUME(RParen)
  })

  private literal = this.RULE('literal', () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(DateTimeLiteral) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) }
    ])
  })

  // Lists
  private columnList = this.RULE('columnList', () => {
    this.SUBRULE(this.columnSpec)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE2(this.columnSpec)
    })
  })

  private columnSpec = this.RULE('columnSpec', () => {
    // Can be: columnName OR alias = expression
    this.CONSUME(Identifier)
    this.OPTION(() => {
      this.CONSUME(Assign)
      this.SUBRULE(this.expression)
    })
  })

  private assignmentList = this.RULE('assignmentList', () => {
    this.SUBRULE(this.assignment)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE2(this.assignment)
    })
  })

  private assignment = this.RULE('assignment', () => {
    this.CONSUME(Identifier)
    this.CONSUME(Assign)
    this.SUBRULE(this.expression)
  })

  private aggregationList = this.RULE('aggregationList', () => {
    this.SUBRULE(this.aggregationSpec)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE2(this.aggregationSpec)
    })
  })

  private aggregationSpec = this.RULE('aggregationSpec', () => {
    // Can be: aggFunc() OR alias = aggFunc()
    this.OPTION(() => {
      this.CONSUME(Identifier)
      this.CONSUME(Assign)
    })
    this.SUBRULE(this.functionCall)
  })

  private identifierList = this.RULE('identifierList', () => {
    this.CONSUME(Identifier)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.CONSUME2(Identifier)
    })
  })

  private sortColumnList = this.RULE('sortColumnList', () => {
    this.SUBRULE(this.sortColumn)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE2(this.sortColumn)
    })
  })

  private sortColumn = this.RULE('sortColumn', () => {
    this.CONSUME(Identifier)
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(Asc) },
        { ALT: () => this.CONSUME(Desc) }
      ])
    })
  })

  private expressionList = this.RULE('expressionList', () => {
    this.SUBRULE(this.expression)
    this.MANY(() => {
      this.CONSUME(Comma)
      this.SUBRULE2(this.expression)
    })
  })
}

export const kqlParser = new KqlParser()
