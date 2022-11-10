export interface IAuthPolicyProvider {
  awsAccountId: string
  principalId: string
  version: string
  pathRegex: RegExp
  allowMethods: any[]
  denyMethods: any[]
  restApiId: string
  region: string
  stage: string

  allowAllMethods(): void
  denyAllMethods(): void
  allowMethod(verb: string, resource: string): void
  denyMethod(verb: string, resource: string): void
  allowMethodWithConditions(
    verb: string, resource: string, conditions: []
  ): void
  denyMethodWithConditions(verb: string, resource: string, conditions: []): void
  build(): any
}
