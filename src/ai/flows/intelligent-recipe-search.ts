'use server';
/**
 * @fileOverview A intelligent recipe search AI agent.
 *
 * - intelligentRecipeSearch - A function that handles the recipe search process.
 * - IntelligentRecipeSearchInput - The input type for the intelligentRecipeSearch function.
 * - IntelligentRecipeSearchOutput - The return type for the intelligentRecipeSearch function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {searchRecipes, Recipe, DietaryRestriction} from '@/services/recipe-search';

const IntelligentRecipeSearchInputSchema = z.object({
  restrictions: z
    .array(z.enum([
      'Doença Celíaca',
      'Intolerância à Lactose',
      'Alergia Alimentar',
      'Diabetes Mellitus',
      'Doença Renal Crônica',
      'Fenilcetonúria',
      'Síndrome do Intestino Irritável',
      'Dislipidemia',
      'Gota',
      'Vegano',
      'Vegetariano',
      'Ovolacto',
    ] as const))
    .describe('The dietary restrictions to consider when searching for recipes.'),
  recipeName: z.string().optional().describe('The name of the recipe to search for.'),
  dishType: z.enum(['doce', 'salgado']).optional().describe('The type of dish to search for (doce or salgado).')
});

export type IntelligentRecipeSearchInput = z.infer<
  typeof IntelligentRecipeSearchInputSchema
>;

const IntelligentRecipeSearchOutputSchema = z.object({
  recipes: z.array(z.object({
    title: z.string().describe('The title of the recipe.'),
    ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
    instructions: z.string().describe('The instructions to prepare the recipe.'),
    sourceUrl: z.string().describe('The URL where the recipe was found.'),
    nutritionalInformation: z.string().optional().describe('Nutritional information for the recipe')
  })).describe('The recipes found based on the dietary restrictions.'),
});

export type IntelligentRecipeSearchOutput = z.infer<
  typeof IntelligentRecipeSearchOutputSchema
>;

let previousRecipes: Recipe[] = [];

export async function intelligentRecipeSearch(
  input: IntelligentRecipeSearchInput
): Promise<IntelligentRecipeSearchOutput> {
    const dishType = input.dishType === null || input.dishType === undefined ? undefined : input.dishType;
    let recipes = await intelligentRecipeSearchFlow({...input, dishType: dishType});
    let attempts = 0;
    const maxAttempts = 5;

    while (previousRecipes.some(prevRecipe =>
        recipes.recipes.some(newRecipe => newRecipe.title === prevRecipe.title)) && attempts < maxAttempts) {
        recipes = await intelligentRecipeSearchFlow({...input, dishType: dishType});
        attempts++;
    }

    if (attempts === maxAttempts) {
        console.warn("Maximum attempts reached. Could not generate a unique recipe.");
    } else {
        previousRecipes = recipes.recipes;
    }

    return recipes;
}

const searchRecipesTool = ai.defineTool({
  name: 'searchRecipes',
  description: 'Search for recipes based on dietary restrictions.',
  inputSchema: z.object({
    restrictions: z
      .array(z.enum([
        'Doença Celíaca',
        'Intolerância à Lactose',
        'Alergia Alimentar',
        'Diabetes Mellitus',
        'Doença Renal Crônica',
        'Fenilcetonúria',
        'Síndrome do Intestino Irritável',
        'Dislipidemia',
        'Gota',
        'Vegano',
        'Vegetariano',
        'Ovolacto',
      ] as const))
      .describe('The dietary restrictions to consider when searching for recipes.'),
      dishType: z.enum(['doce', 'salgado']).optional().describe('The type of dish to search for (doce or salgado).')
  }),
  outputSchema: z.array(z.object({
    title: z.string().describe('The title of the recipe.'),
    ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
    instructions: z.string().describe('The instructions to prepare the recipe.'),
    sourceUrl: z.string().describe('The URL where the recipe was found.'),
    nutritionalInformation: z.string().optional().describe('Nutritional information for the recipe')
  })),
},
async input => {
    return await searchRecipes(input.restrictions, input.dishType);
  }
);


const prompt = ai.definePrompt({
  name: 'intelligentRecipeSearchPrompt',
  tools: [searchRecipesTool],
  input: {
    schema: z.object({
      restrictions: z
        .array(z.enum([
          'Doença Celíaca',
          'Intolerância à Lactose',
          'Alergia Alimentar',
          'Diabetes Mellitus',
          'Doença Renal Crônica',
          'Fenilcetonúria',
          'Síndrome do Intestino Irritável',
          'Dislipidemia',
          'Gota',
          'Vegano',
          'Vegetariano',
          'Ovolacto',
        ] as const))
        .describe('The dietary restrictions to consider when searching for recipes.'),
        recipeName: z.string().optional().describe('The name of the recipe to search for.'),
        dishType: z.enum(['doce', 'salgado']).optional().describe('The type of dish to search for (doce or salgado).')
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(z.object({
        title: z.string().describe('The title of the recipe.'),
        ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
        instructions: z.string().describe('The instructions to prepare the recipe.'),
        sourceUrl: z.string().describe('The URL where the recipe was found.'),
        nutritionalInformation: z.string().optional().describe('Nutritional information for the recipe')
      })).describe('The recipes found based on the dietary restrictions.'),
    }),
  },
  prompt: `You are a recipe adaptation expert. A user with certain dietary restrictions wants to find recipes online and adapt them to their needs.  If the user specifies the recipe, then search specifically for that. Then adapt the recipe according to the restrictions, if the user has not specified a recipe, use the searchRecipes tool to generate some recipes according to the dietary restrictions.

Restrictions: {{{restrictions}}}
Recipe Name: {{{recipeName}}}

{{#if dishType}}
Dish Type: {{{dishType}}}
{{else}}
Como o usuário não especificou o tipo de prato, retorne ao menos duas receitas doces e duas salgadas.
{{/if}}

{{#if restrictions}}
  Here are some recipes that adhere to these restrictions, use the searchRecipes tool to find recipes that meet the dietary restrictions.
{{else}}
  Find general recipes.
{{/if}}
`,
});

const intelligentRecipeSearchFlow = ai.defineFlow<
  typeof IntelligentRecipeSearchInputSchema,
  typeof IntelligentRecipeSearchOutputSchema
>({
  name: 'intelligentRecipeSearchFlow',
  inputSchema: IntelligentRecipeSearchInputSchema,
  outputSchema: IntelligentRecipeSearchOutputSchema,
},
async input => {
  const {output} = await prompt(input);
    return output!;
});
