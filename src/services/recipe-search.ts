/**
 * Represents a recipe with its details.
 */
export interface Recipe {
  /**
   * The title of the recipe.
   */
  title: string;
  /**
   * The ingredients required for the recipe.
   */
  ingredients: string[];
  /**
   * The instructions to prepare the recipe.
   */
  instructions: string;
  /**
   * The URL where the recipe was found.
   */
  sourceUrl: string;
  /**
   * Nutritional information for the recipe
   */
  nutritionalInformation?: string;
}

/**
 * Represents dietary restrictions.
 */
export type DietaryRestriction =
  | 'Doença Celíaca'
  | 'Intolerância à Lactose'
  | 'Alergia Alimentar'
  | 'Diabetes Mellitus'
  | 'Doença Renal Crônica'
  | 'Fenilcetonúria'
  | 'Síndrome do Intestino Irritável'
  | 'Doença Inflamatória Intestinal'
  | 'Dislipidemia'
  | 'Gota';

/**
 * Asynchronously searches for recipes based on dietary restrictions.
 *
 * @param restrictions An array of dietary restrictions to consider.
 * @returns A promise that resolves to an array of Recipe objects.
 */
export async function searchRecipes(
  restrictions: DietaryRestriction[]
): Promise<Recipe[]> {
  // TODO: Implement this by calling an API or scraping the web.

  return [
    {
      title: 'Stub Recipe',
      ingredients: ['Ingredient 1', 'Ingredient 2'],
      instructions: 'Step 1: Do this. Step 2: Do that.',
      sourceUrl: 'https://example.com/stub-recipe',
      nutritionalInformation: 'Calories: 200, Protein: 10g'
    },
  ];
}
