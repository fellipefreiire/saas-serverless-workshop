import { APIGatewayAuthorizerResult } from 'aws-lambda'
import { HttpVerb } from "../../../entities/HttpVerb"
import { IAuthPolicyProvider } from '../../IAuthPolicyProvider'
const httpVerb = new HttpVerb()

export class AuthPolicyProvider implements IAuthPolicyProvider {
  awsAccountId: string
  principalId: string
  version = '2012-10-17'
  pathRegex = /^[/.a-zA-Z0-9-\*]+$/

  allowMethods: any[]
  denyMethods: any[]

  restApiId = '*'
  region = '*'
  stage = '*'

  constructor(
    awsAccountId = '',
    principalId = '',
    allowMethods = [],
    denyMethods = [],
  ) {
    this.awsAccountId = awsAccountId
    this.principalId = principalId
    this.allowMethods = allowMethods
    this.denyMethods = denyMethods
  }

  public allowAllMethods(): void {
    this.__addMethod('Allow', httpVerb.ALL, '*', [])
  }

  public denyAllMethods(): void {
    this.__addMethod('Deny', httpVerb.ALL, '*', [])
  }

  public allowMethod(
    verb: string,
    resource: string
  ): void {
    this.__addMethod('Allow', verb, resource, [])
  }

  public denyMethod(
    verb: string,
    resource: string
  ): void {
    this.__addMethod('Deny', verb, resource, [])
  }

  public allowMethodWithConditions(
    verb: string,
    resource: string,
    conditions: []
  ): void {
    this.__addMethod('Allow', verb, resource, conditions)
  }

  public denyMethodWithConditions(
    verb: string,
    resource: string,
    conditions: []
  ): void {
    this.__addMethod('Deny', verb, resource, conditions)
  }

  public build(): APIGatewayAuthorizerResult {
    if (
      (this.allowMethods === undefined || this.allowMethods.length === 0) && (this.denyMethods === undefined || this.denyMethods.length === 0)) {
      throw new Error('No statements defined for the policy')
    }

    const policy: APIGatewayAuthorizerResult = {
      'principalId': this.principalId,
      'policyDocument': {
        'Version': this.version,
        'Statement': []
      }
    }

    const allowMethodsStatements = this
      .__getStatementForEffect('Allow', this.allowMethods)

    const denyMethodsStatements = this
      .__getStatementForEffect('Deny', this.denyMethods)

    policy.policyDocument.Statement.push(...allowMethodsStatements)
    policy.policyDocument.Statement.push(...denyMethodsStatements)

    return policy
  }

  private __addMethod(
    effect: string,
    verb: string,
    resource: string,
    conditions: [] | null
  ) {
    const httpVerb = new HttpVerb()

    if ((verb !== '*') && !(httpVerb.hasOwnProperty(verb))) {
      throw new Error(`Invalid HTTP verb ${verb}. Allowed verbs in HttpVerb`)
    }

    const resourcePattern = this.pathRegex

    if (!resourcePattern.test(resource)) {
      throw new Error(`Invalid resource path: ${resource}. Path should match ${this.pathRegex}`)
    }

    if (resource[resource.length - 1] === '/') {
      resource = resource.slice(1)
    }

    const resourceArn = `arn:aws:execute-api:${this.region}:${this.awsAccountId}:${this.restApiId}/${this.stage}/${verb}/${resource}`

    if (effect.toLowerCase() === 'allow') {
      this.allowMethods.push({
        'resourceArn': resourceArn,
        'conditions': conditions
      })
    } else if (effect.toLowerCase() === 'deny') {
      this.denyMethods.push({
        'resourceArn': resourceArn,
        'conditions': conditions
      })
    }
  }

  private __getEmptyStatement(
    effect: string
  ): any {
    const statement: any = {
      'Action': 'execute-api:Invoke',
      'Effect': effect[effect.length - 1].toUpperCase() + effect.slice(1).toLowerCase(),
      'Resource': []
    }

    return statement
  }

  private __getStatementForEffect(
    effect: string,
    methods: any[]
  ): AWSLambda.Statement[] {
    const statements = []

    if (methods.length > 0) {
      const statement = this.__getEmptyStatement(effect)

      for (const curMethod of methods) {
        if (curMethod.conditions === undefined || curMethod.conditions?.length === 0) {
          statement.Resource.push(curMethod.resourceArn)
        } else {
          const conditionalStatement = this.__getEmptyStatement(effect)
          conditionalStatement.Resource.push(curMethod.resourceArn)
          conditionalStatement.Condition = curMethod.conditions
          statements.push(conditionalStatement)
        }
      }
    }

    return statements
  }
}
