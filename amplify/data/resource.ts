
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  RecipeResult: a.customType({
    body: a.string().required(),
  }),

  askBedrock: a
    .query()
    .arguments({
      ingredients: a.string().array().required(),
    })
    .returns(a.ref("RecipeResult"))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: "BedrockDataSource",
        entry: "./bedrock.js",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
