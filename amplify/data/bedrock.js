
export function request(ctx) {
  const ingredients = ctx.args.ingredients || [];

  const prompt = `Suggest a recipe using these ingredients: ${ingredients.join(", ")}. Include the recipe name, ingredients, and cooking instructions.`;

  return {
    resourcePath: `/model/${ctx.env.MODEL_ID}/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      },
    },
  };
}

export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);

  return {
    body: parsedBody.content[0].text,
  };
}
