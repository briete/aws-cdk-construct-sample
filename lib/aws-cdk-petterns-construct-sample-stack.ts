import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');

export class AwsCdkPatternsConstructLibrarySampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'SampleCluster', {
      clusterName: 'SampleCluster',
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');
    const container = taskDefinition.addContainer('SampleContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    container.addPortMappings({
      containerPort: 80
    });

    const appLoadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'SampleService', {
      cluster: cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      desiredCount: 1,
      taskDefinition: taskDefinition
    });
  }
}
