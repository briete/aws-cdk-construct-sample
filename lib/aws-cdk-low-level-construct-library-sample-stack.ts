import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigateway = require('@aws-cdk/aws-apigateway');
import iam = require('@aws-cdk/aws-iam');

export class AwsCdkLowLevelConstructLibrarySampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const region: string = cdk.Stack.of(this).region;
    const accountId: string = cdk.Stack.of(this).account;

    const lambdaServiceRole = new iam.CfnRole(this, 'sampleLambdaServiceRole', {
      assumeRolePolicyDocument: {
        "Statement": [
          {
            "Action": "sts:AssumeRole",
            "Effect": "Allow",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            }
          }
        ],
        "Version": "2012-10-17"
      },
      managedPolicyArns: [
        "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
      ]
    });

    const lambdaFunction = new lambda.CfnFunction(this, 'SampleLambdaFunction', {
      code: {
        s3Bucket: "cdktoolkit-stagingbucket-1cgsijg6hxw5g",
        s3Key: "assets/AwsCdkConstructLibrarySampleStacksamplelambdaCode526039A8/f89c7f69ce71dea9484843b39117602a3b3fdc6ac0dafb84f07fe940c8141974.zip"
      },
      handler: "app.handler",
      role: lambdaServiceRole.attrArn,
      runtime: "nodejs10.x" 
    });

    lambdaFunction.addDependsOn(lambdaServiceRole);

    const api = new apigateway.CfnRestApi(this, 'SampleRestApi', {
      name: "SampleApi"
    });

    const cloudwatchRole = new iam.CfnRole(this, 'CloudWatchRole', {
      assumeRolePolicyDocument: {
        "Statement": [
          {
            "Action": "sts:AssumeRole",
            "Effect": "Allow",
            "Principal": {
              "Service": "apigateway.amazonaws.com"
            }
          }
        ],
        "Version": "2012-10-17"
      },
      managedPolicyArns: [
        "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
      ]
    });

    const apiAccount = new apigateway.CfnAccount(this, 'SampleApiAccount', {
      cloudWatchRoleArn: cloudwatchRole.attrArn
    });
    apiAccount.addDependsOn(api);

    const apiResource = new apigateway.CfnResource(this, 'SampleApiResource', {
      parentId: api.attrRootResourceId,
      pathPart: "sample",
      restApiId: api.ref
    });

    const apiMethod = new apigateway.CfnMethod(this, 'SampleApiMethod', {
      httpMethod: "POST",
      resourceId: apiResource.ref,
      restApiId: api.ref,
      authorizationType: "NONE",
      integration: {
        integrationHttpMethod: "POST",
        type: "AWS_PROXY",
        uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaFunction.attrArn}/invocations`
      }
    });

    const apiDeployment = new apigateway.CfnDeployment(this, 'Deployment', {
      restApiId: api.ref
    });
    apiDeployment.addDependsOn(apiMethod);
    apiDeployment.addDependsOn(apiResource);

    const apiStage = new apigateway.CfnStage(this, 'SampleStage', {
      restApiId: api.ref,
      deploymentId: apiDeployment.ref,
      stageName: "prod"
    });

    new lambda.CfnPermission(this, 'SampleLambdaPermission', {
      action: "lambda:InvokeFunction",
      functionName: lambdaFunction.attrArn,
      principal: "apigateway.amazonaws.com",
      sourceArn: `arn:aws:execute-api:${region}:${accountId}:${api.ref}/${apiStage.ref}/POST/sample`
    });

    new lambda.CfnPermission(this, 'TestSamleLambdaPermission', {
      action: "lambda:InvokeFunction",
      functionName: lambdaFunction.attrArn,
      principal: "apigateway.amazonaws.com",
      sourceArn: `arn:aws:execute-api:${region}:${accountId}:${api.ref}/test-invoke-stage/POST/sample`
    });
  }
}
