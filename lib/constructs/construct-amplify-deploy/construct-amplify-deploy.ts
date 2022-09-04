import { Construct } from 'constructs';
import { aws_iam as iam, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { aws_codecommit as codecommit } from 'aws-cdk-lib';
import * as Amplify from "@aws-cdk/aws-amplify-alpha"

interface AmplifyDeployProps {
  appPath: string;
  repoName: string;
  region: string;
  apiId: string;
  graphqlUrl: string;
  identityPoolId: string;
  userPoolId: string;
  userPoolWebClientId: string;
  landingBucketName: string;

}

export class AmplifyDeploy extends Construct {
  public repository: codecommit.Repository;
  public amplifyApp: Amplify.App;

  constructor(scope: Construct, id: string, props: AmplifyDeployProps) {
    super(scope, id)
        

        const repository = new codecommit.Repository(this, 'AmplifyCodeCommitRepository', {
            repositoryName: props.repoName,
            description: "Amplify Web Application Deployment Repository",
            code: codecommit.Code.fromDirectory(props.appPath, 'dev'),
        });

        const amplifyApp = new Amplify.App(this, 'CarbonLakeQSWebApp', {
          description: "Sample AWS Amplify Application for CarbonLake Quickstart Development Kit",
          sourceCodeProvider: new Amplify.CodeCommitSourceCodeProvider({
            repository: repository
          },
          ),
          environmentVariables: {
            'REGION': props.region,
            'API_ID': props.apiId,
            'GRAPH_QL_URL': props.graphqlUrl,
            'IDENTITY_POOL_ID': props.identityPoolId,
            'USER_POOL_ID': props.userPoolId,
            'USER_POOL_WEB_CLIENT_ID': props.userPoolWebClientId,
            'UPLOAD_BUCKET': props.landingBucketName,
          }
        })

        const devBranch = amplifyApp.addBranch('dev');

        amplifyApp.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
}
