import { StackProps, Stack, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'node:path';

const binPath = '../../backend/';

export class InfrastructureStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		/**
		 * @description
		 */
		const goLambdaFunction = new Function(this, 'GoLambdaFunction', {
			runtime: Runtime.PROVIDED_AL2,
			code: Code.fromAsset(join(__dirname, binPath, 'build/')),
			handler: 'bootstrap',
			timeout: Duration.seconds(30),
			memorySize: 128,
			environment: {
				ENVIRONMENT: 'production',
			},
		});

		/**
		 * @description
		 */
		const api = new RestApi(this, 'GoLambdaAPI', {
			restApiName: 'Go Lambda Service',
			description: 'This service serves Go Lambda functions',
		});

		/**
		 * @description
		 */
		const lambdaIntegration = new LambdaIntegration(goLambdaFunction);
		const helloResource = api.root
			.addResource('hello-world')
			.addResource('{userName}');
		helloResource.addMethod('GET', lambdaIntegration);
		helloResource.addMethod('OPTIONS', lambdaIntegration);

		/**
		 * @description
		 */
		new CfnOutput(this, 'ApiEndpoint', {
			value: api.url,
			description: 'The URL of the API Gateway',
		});
	}
}
