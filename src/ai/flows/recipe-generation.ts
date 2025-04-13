'use server';
/**
 * @fileOverview Generates recipes based on dietary restrictions.
 *
 * - generateRecipe - A function that generates a recipe based on dietary restrictions.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {DietaryRestriction, searchRecipes, Recipe} from '@/services/recipe-search';

const GenerateRecipeInputSchema = z.object({
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
      'Vegano',
      'Vegetariano',
      'Ovolacto',
    ] as const))
    .describe('The dietary restrictions to consider when generating the recipe.'),
    ingredients: z.string().optional().describe('A comma separated list of ingredients to include in the recipe.'),
    dishType: z.enum(['doce', 'salgado']).optional().describe('The type of dish to generate (doce or salgado).')
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipes: z.array(z.object({
    title: z.string().describe('The title of the recipe.'),
    ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
    instructions: z.string().describe('The instructions to prepare the recipe.'),
    sourceUrl: z.string().describe('The URL where the recipe was found.'),
    nutritionalInformation: z.string().optional().describe('Nutritional information for the recipe')
  })).describe('The generated recipes based on the dietary restrictions.'),
});

export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const recipeSearchTool = ai.defineTool({
  name: 'searchRecipes',
  description: 'Search for recipes based on dietary restrictions.',
  inputSchema: z.object({
    restrictions: z.array(z.enum([
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
      'Vegano',
      'Vegetariano',
      'Ovolacto',
    ] as const)).describe('The dietary restrictions to consider when searching for recipes.'),
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
async (input) => {
  return await searchRecipes(input.restrictions as DietaryRestriction[], input.dishType);
});

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  tools: [recipeSearchTool],
  input: {
    schema: GenerateRecipeInputSchema,
  },
  output: {
    schema: GenerateRecipeOutputSchema,
  },
  prompt: `Você é um especialista em culinária saudável e adaptada a restrições alimentares.

  O usuário tem as seguintes restrições alimentares: {{restrictions}}.
  {{#if ingredients}}
  O usuário quer incluir os seguintes ingredientes: {{ingredients}}
  {{/if}}
  {{#if dishType}}
  O usuário prefere receitas do tipo: {{dishType}}
  {{else}}
  Como o usuário não especificou o tipo de prato, inclua pelo menos duas receitas doces e duas salgadas.
  {{/if}}

  Sua tarefa é gerar receitas que atendam a essas restrições, use os ingredientes, e seja do tipo especificado. Se necessário, use a ferramenta searchRecipes para encontrar receitas existentes e adaptá-las.
  A saida deve ser um array de receitas que atendam as restricoes do usuario.
`,
});

const generateRecipeFlow = ai.defineFlow<
  typeof GenerateRecipeInputSchema,
  typeof GenerateRecipeOutputSchema
>({
  name: 'generateRecipeFlow',
  inputSchema: GenerateRecipeInputSchema,
  outputSchema: GenerateRecipeOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
