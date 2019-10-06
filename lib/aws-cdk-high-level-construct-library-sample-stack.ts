import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigateway = require('@aws-cdk/aws-apigateway');

export class AwsCdkHighLevelConstructLibrarySampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sampleLambda = new lambda.Function(this, 'sample-lambda', {
      code: lambda.Code.asset('src/handler'),
      handler: 'app.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const api = new apigateway.RestApi(this, 'api', {
      restApiName: 'SampleApi'
    });

    const integration = new apigateway.LambdaIntegration(sampleLambda, {
      proxy: true
    });

    const resource = api.root.addResource('sample');
    resource.addMethod('POST', integration);
  }
}
