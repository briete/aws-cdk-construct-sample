#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsCdkHighLevelConstructLibrarySampleStack } from '../lib/aws-cdk-high-level-construct-library-sample-stack';
import { AwsCdkLowLevelConstructLibrarySampleStack } from '../lib/aws-cdk-low-level-construct-library-sample-stack';
import { AwsCdkPatternsConstructLibrarySampleStack } from '../lib/aws-cdk-petterns-construct-sample-stack';

const app = new cdk.App();
new AwsCdkHighLevelConstructLibrarySampleStack(app, 'AwsCdkHighLevelConstructLibrarySampleStack');
new AwsCdkLowLevelConstructLibrarySampleStack(app, 'AwsCdkLowLevelConstructLibrarySampleStack');
new AwsCdkPatternsConstructLibrarySampleStack(app, 'AwsCdkPatternsConstructLibrarySampleStack');
