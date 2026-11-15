
import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import "./App.css";

const client = generateClient<Schema>();

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setRecipe("");
    setError("");

    try {
      const ingredientList = ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const { data, errors } = await client.queries.askBedrock({
        ingredients: ingredientList,
      });

      if (errors?.length) {
        throw new Error(errors.map((item) => item.message).join(", "));
      }

      setRecipe(data?.body ?? "No recipe was returned. Please try again.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="recipe-container">
      <header>
        <p className="creator">Created by Teesha Talreja</p>
        <h1>AI Recipe Generator</h1>
        <p>Turn the ingredients you have into delicious recipe ideas.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label htmlFor="ingredients">Enter your ingredients</label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(event) => setIngredients(event.target.value)}
          placeholder="Example: chicken, rice, tomatoes, onions"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating recipe..." : "Generate Recipe"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {recipe && (
        <section className="recipe-result">
          <h2>Your AI-Generated Recipe</h2>
          <p>{recipe}</p>
        </section>
      )}

      <footer>AI Recipe Generator | Teesha Talreja</footer>
    </main>
  );
}

export default App;
