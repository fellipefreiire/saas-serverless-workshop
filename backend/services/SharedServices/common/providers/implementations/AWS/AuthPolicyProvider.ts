import { APIGatewayAuthorizerResult } from 'aws-lambda'

import { IAuthPolicyProvider } from '../../interfaces/IAuthPolicyProvider'
import { IHttpVerbProvider } from '../../interfaces/IHttpVerbProvider'

export class AWSAuthPolicyProvider implements IAuthPolicyProvider {
  public awsAccountId = ''
  public principalId = ''
  public version = '2012-10-17'
  public pathRegex = /^[/.a-zA-Z0-9-\*]+$/

  public allowMethods: any[]
  public denyMethods: any[]

  public restApiId = '*'
  public region = '*'
  public stage = '*'

  constructor(
    private httpVerbProvider: IHttpVerbProvider
  ) { }

  public allowAllMethods(): void {
    this.__addMethod('Allow', this.httpVerbProvider.ALL, '*', [])
  }

  public denyAllMethods(): void {
    this.__addMethod('Deny', this.httpVerbProvider.ALL, '*', [])
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
    if ((this.allowMethods === undefined ||
      this.allowMethods.length === 0
    ) &&
      (this.denyMethods === undefined ||
        this.denyMethods.length === 0
      )) {
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
    if ((verb !== '*') && !(this.httpVerbProvider.hasOwnProperty(verb))) {
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
