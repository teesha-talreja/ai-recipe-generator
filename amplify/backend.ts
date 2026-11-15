
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

export const backend = defineBackend({
  auth,
  data,
});

const MODEL_ID = "us.anthropic.claude-sonnet-4-6";

const bedrockDataSource = backend.data.addHttpDataSource(
  "BedrockDataSource",
  "https://bedrock-runtime.us-east-2.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-2",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:us-east-2:*:inference-profile/${MODEL_ID}`,
      "arn:aws:bedrock:*::foundation-model/anthropic.claude-sonnet-4-6",
    ],
  })
);

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  MODEL_ID,
};
