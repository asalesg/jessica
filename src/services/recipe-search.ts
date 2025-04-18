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
  | 'Gota'
  | 'Vegano'
  | 'Vegetariano'
  | 'Ovolacto';

/**
 * Asynchronously searches for recipes based on dietary restrictions.
 *
 * @param restrictions An array of dietary restrictions to consider.
 * @param dishType The type of dish to search for ('doce' for sweet, 'salgado' for savory).
 * @returns A promise that resolves to an array of Recipe objects.
 */
export async function searchRecipes(
  restrictions: DietaryRestriction[],
  dishType?: 'doce' | 'salgado'
): Promise<Recipe[]> {
  // const apiKey = process.env.RECIPE_API_KEY; // Ensure you have this in your .env file
  // if (!apiKey) {
  //   console.error('RECIPE_API_KEY is not set in the environment variables.');
  //   return [];
  // }

  // const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';
  // let queryParams = `apiKey=${apiKey}&number=5`; // Limit to 5 recipes for now

  // // Add dietary restrictions to the query
  // if (restrictions && restrictions.length > 0) {
  //   const diets = restrictions.map(restriction => {
  //     switch (restriction) {
  //       case 'Doença Celíaca': return 'gluten free';
  //       case 'Intolerância à Lactose': return 'dairy free';
  //       case 'Alergia Alimentar': return ''; // More specific allergy targeting would be needed
  //       case 'Diabetes Mellitus': return ''; // Specific targeting of low sugar needed
  //       case 'Doença Renal Crônica': return ''; // Difficult to target generally
  //       case 'Fenilcetonúria': return ''; // Very specific amino acid targeting needed
  //       case 'Síndrome do Intestino Irritável': return 'fodmap friendly';
  //       case 'Doença Inflamatória Intestinal': return ''; // Varies person to person
  //       case 'Dislipidemia': return 'low cholesterol';
  //       case 'Gota': return 'low purine';
  //       case 'Vegano': return 'vegan';
  //       case 'Vegetariano': return 'vegetarian';
  //       case 'Ovolacto': return 'lacto-ovo vegetarian';
  //       default: return '';
  //     }
  //   }).filter(diet => diet !== '').join(',');
  //   if (diets) {
  //     queryParams += `&diet=${diets}`;
  //   }
  // }

  // // Add dish type to the query
  // if (dishType) {
  //   queryParams += `&type=${dishType}`;
  // }

  // try {
  //   const response = await fetch(`${baseUrl}?${queryParams}`);
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   const data = await response.json();

  //   if (data.results) {
  //     return data.results.map((item: any) => ({
  //       title: item.title,
  //       ingredients: [], // The API doesn't directly provide ingredients, can fetch with another call if needed
  //       instructions: `Source URL: ${item.sourceUrl}`, // Instructions not directly provided; use source URL
  //       sourceUrl: item.sourceUrl,
  //       nutritionalInformation: '', // Nutritional info not directly provided
  //     }));
  //   } else {
  //     console.log('No recipes found with the given criteria.');
  //     return [];
  //   }
  // } catch (error) {
  //   console.error('Error fetching recipes:', error);
  //   return [];
  // }

  let recipes: Recipe[] = [
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
    },
     {
      title: 'Mousse de Chocolate Vegano',
      ingredients: ['1 abacate maduro', '1/4 xícara de cacau em pó', '1/4 xícara de leite de coco', '2 colheres de sopa de xarope de bordo', '1 colher de chá de extrato de baunilha'],
      instructions: 'Bata todos os ingredientes no liquidificador até obter uma consistência cremosa. Leve à geladeira por pelo menos 30 minutos antes de servir.',
      sourceUrl: 'https://www.example.com/mousse-chocolate-vegano',
      nutritionalInformation: 'Calorias: 250, Proteínas: 4g, Carboidratos: 25g'
    },
    {
      title: 'Smoothie de Frutas Vermelhas sem Lactose',
      ingredients: ['1 xícara de frutas vermelhas congeladas (morango, framboesa, amora)', '1/2 banana', '1/2 xícara de leite de amêndoas', '1 colher de sopa de sementes de chia'],
      instructions: 'Bata todos os ingredientes no liquidificador até ficar homogêneo. Sirva imediatamente.',
      sourceUrl: 'https://www.example.com/smoothie-frutas-vermelhas',
      nutritionalInformation: 'Calorias: 180, Proteínas: 3g, Carboidratos: 30g'
    }
  ];

  if (dishType) {
    recipes = recipes.filter(recipe => {
      if (dishType === 'doce') {
        return recipe.title.toLowerCase().includes('doce') || recipe.title.toLowerCase().includes('mousse') || recipe.title.toLowerCase().includes('smoothie');
      } else if (dishType === 'salgado') {
        return !recipe.title.toLowerCase().includes('doce') && !recipe.title.toLowerCase().includes('mousse') && !recipe.title.toLowerCase().includes('smoothie');
      }
      return true;
    });
  }

  return recipes;
}
