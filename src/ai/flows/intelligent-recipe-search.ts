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
      'Doença Inflamatória Intestinal',
      'Dislipidemia',
      'Gota',
    ] as const))
    .describe('The dietary restrictions to consider when searching for recipes.'),
  recipeName: z.string().optional().describe('The name of the recipe to search for.'),
});

export type IntelligentRecipeSearchInput = z.infer<
  typeof IntelligentRecipeSearchInputSchema
>;

const IntelligentRecipeSearchOutputSchema = z.object({
  recipes: z.array(z.any()).describe('The recipes found based on the dietary restrictions.'),
});

export type IntelligentRecipeSearchOutput = z.infer<
  typeof IntelligentRecipeSearchOutputSchema
>;

export async function intelligentRecipeSearch(
  input: IntelligentRecipeSearchInput
): Promise<IntelligentRecipeSearchOutput> {
  return intelligentRecipeSearchFlow(input);
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
        'Doença Inflamatória Intestinal',
        'Dislipidemia',
        'Gota',
      ] as const))
      .describe('The dietary restrictions to consider when searching for recipes.'),
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
    return await searchRecipes(input.restrictions);
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
          'Doença Inflamatória Intestinal',
          'Dislipidemia',
          'Gota',
        ] as const))
        .describe('The dietary restrictions to consider when searching for recipes.'),
        recipeName: z.string().optional().describe('The name of the recipe to search for.'),
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

