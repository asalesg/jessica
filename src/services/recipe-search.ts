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
      title: 'Arroz com Frango e Legumes (Sem Glúten e Lactose)',
      ingredients: ['1 xícara de arroz branco', '200g de peito de frango em cubos', '1/2 xícara de brócolis picado', '1/2 xícara de cenoura em cubos pequenos', '1/4 de cebola picada', '1 dente de alho picado', 'Azeite de oliva a gosto', 'Sal e temperos a gosto'],
      instructions: 'Cozinhe o arroz conforme as instruções. Em uma panela, refogue a cebola e o alho no azeite, adicione o frango e tempere. Acrescente os legumes e refogue por mais alguns minutos. Misture o frango com legumes ao arroz cozido e sirva.',
      sourceUrl: 'https://www.example.com/arroz-frango-legumes',
      nutritionalInformation: 'Calorias: 350, Proteínas: 25g, Carboidratos: 45g'
    },
    {
      title: 'Sopa Cremosa de Abóbora e Gengibre (Vegana)',
      ingredients: ['500g de abóbora em cubos', '1 pedaço pequeno de gengibre ralado', '1/2 cebola picada', '500ml de caldo de legumes', '1/2 xícara de leite de coco', 'Azeite de oliva a gosto', 'Sal e pimenta a gosto', 'Sementes de abóbora para decorar'],
      instructions: 'Refogue a cebola e o gengibre no azeite. Adicione a abóbora e o caldo de legumes, cozinhe até a abóbora ficar macia. Bata a sopa no liquidificador, adicione o leite de coco e tempere. Sirva com sementes de abóbora.',
      sourceUrl: 'https://www.example.com/sopa-abobora-gengibre',
      nutritionalInformation: 'Calorias: 200, Proteínas: 5g, Carboidratos: 30g'
    },
    {
      title: 'Salada Fresca de Quinoa com Grão de Bico (Sem Glúten)',
      ingredients: ['1 xícara de quinoa cozida', '1 xícara de grão de bico cozido', '1/2 pepino em cubos', '1/2 tomate em cubos', '1/4 de pimentão vermelho picado', 'Suco de 1 limão', 'Azeite de oliva a gosto', 'Salsinha picada a gosto', 'Sal e pimenta a gosto'],
      instructions: 'Misture todos os ingredientes em uma tigela. Tempere com suco de limão, azeite, sal, pimenta e salsinha. Sirva fria.',
      sourceUrl: 'https://www.example.com/salada-quinoa-grao-de-bico',
      nutritionalInformation: 'Calorias: 280, Proteínas: 12g, Carboidratos: 40g'
    }
  ];
}
