'use client';

import {useState, useEffect, useCallback} from 'react';
import {DietaryRestriction, Recipe} from '@/services/recipe-search';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {intelligentRecipeSearch} from '@/ai/flows/intelligent-recipe-search';
import {generateRecipe} from '@/ai/flows/recipe-generation';
import {useToast} from '@/hooks/use-toast';
import {Heart, HeartOff} from 'lucide-react';

const dietaryRestrictionsList: {
  value: DietaryRestriction;
  label: string;
  description: string;
}[] = [
  {
    value: 'Doença Celíaca',
    label: 'Doença Celíaca',
    description: 'Restrição: Glúten (presente em trigo, centeio e cevada)',
  },
  {
    value: 'Intolerância à Lactose',
    label: 'Intolerância à Lactose',
    description: 'Restrição: Lactose (açúcar do leite)',
  },
  {
    value: 'Alergia Alimentar',
    label: 'Alergia Alimentar',
    description: 'Restrição: O alimento específico que causa a reação alérgica',
  },
  {
    value: 'Diabetes Mellitus',
    label: 'Diabetes Mellitus',
    description: 'Restrição: Açúcares simples e carboidratos refinados',
  },
  {
    value: 'Doença Renal Crônica',
    label: 'Doença Renal Crônica',
    description: 'Restrição: Sódio, potássio, fósforo e, às vezes, proteína',
  },
  {
    value: 'Fenilcetonúria',
    label: 'Fenilcetonúria (PKU)',
    description: 'Restrição: Fenilalanina (presente em proteínas e adoçantes como aspartame)',
  },
  {
    value: 'Síndrome do Intestino Irritável',
    label: 'Síndrome do Intestino Irritável (FODMAP)',
    description: 'Restrição: Alimentos ricos em FODMAPs (carboidratos fermentáveis)',
  },
  {
    value: 'Doença Inflamatória Intestinal',
    label: 'Doença Inflamatória Intestinal (Crohn e Retocolite Ulcerativa)',
    description: 'Restrição: Alimentos que irritam o intestino (varia por pessoa)',
  },
  {
    value: 'Dislipidemia',
    label: 'Dislipidemia (colesterol ou triglicerídes altos)',
    description: 'Restrição: Gorduras saturadas, trans e excesso de carboidratos simples',
  },
  {
    value: 'Gota',
    label: 'Gota (hiperuricemia)',
    description: 'Restrição: Alimentos ricos em purinas (carnes vermelhas, frutos do mar, bebidas alcoólicas)',
  },
];

export default function Home() {
  const [selectedRestrictions, setSelectedRestrictions] = useState<DietaryRestriction[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [generating, setGenerating] = useState(false);
  const [searching, setSearching] = useState(false);
  const {toast} = useToast();
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const handleRestrictionChange = (restriction: DietaryRestriction) => {
    setSelectedRestrictions((prevRestrictions) => {
      if (prevRestrictions.includes(restriction)) {
        return prevRestrictions.filter((r) => r !== restriction);
      } else {
        return [...prevRestrictions, restriction];
      }
    });
  };

  const handleGenerateRecipes = async () => {
    if (selectedRestrictions.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos uma restrição alimentar.',
      });
      return;
    }

    setGenerating(true);
    try {
      const generatedRecipes = await generateRecipe({restrictions: selectedRestrictions});
      setRecipes(generatedRecipes.recipes);
    } catch (error: any) {
      console.error('Erro ao gerar receitas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar receitas: ' + error.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSearchRecipes = async () => {
    if (selectedRestrictions.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos uma restrição alimentar.',
      });
      return;
    }
    setSearching(true);
    try {
      const searchResults = await intelligentRecipeSearch({restrictions: selectedRestrictions});
      if (!searchResults || !searchResults.recipes || searchResults.recipes.length === 0) {
        toast({
          title: 'Nenhuma receita encontrada',
          description: 'Não foi possível encontrar receitas com as restrições selecionadas.',
        });
        setRecipes([]); // Clear existing recipes
      } else {
        setRecipes(searchResults.recipes);
      }
    } catch (error: any) {
      console.error('Erro ao buscar receitas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao buscar receitas: ' + error.message,
      });
      setRecipes([]); // Clear existing recipes
    } finally {
      setSearching(false);
    }
  };

  const toggleFavorite = useCallback((recipe: Recipe) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.title === recipe.title);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.title !== recipe.title);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  }, []);

  const isFavorite = useCallback((recipe: Recipe) => {
    return favorites.some((fav) => fav.title === recipe.title);
  }, [favorites]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-500">Chef Saúde</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Selecione suas Restrições Alimentares</CardTitle>
          <CardDescription>Escolha as restrições que se aplicam a você para que possamos encontrar ou gerar receitas adequadas.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {dietaryRestrictionsList.map((restriction) => (
            <div key={restriction.value} className="flex items-center space-x-2">
              <Checkbox
                id={restriction.value}
                checked={selectedRestrictions.includes(restriction.value)}
                onCheckedChange={() => handleRestrictionChange(restriction.value)}
              />
              <label
                htmlFor={restriction.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {restriction.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex space-x-4 mb-4">
        <Button
          onClick={handleGenerateRecipes}
          className="bg-green-500 text-white rounded-md p-2 hover:bg-green-700 transition duration-300"
          disabled={generating}
        >
          {generating ? 'Gerando...' : 'Gerar Receitas'}
        </Button>
        <Button
          onClick={handleSearchRecipes}
          className="bg-orange-500 text-white rounded-md p-2 hover:bg-orange-700 transition duration-300"
          disabled={searching}
        >
          {searching ? 'Buscando...' : 'Buscar Receitas'}
        </Button>
      </div>

      {/* Favorite Recipes Section */}
      {favorites.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Receitas Favoritas:</h2>
          <div className="grid gap-4">
            {favorites.map((recipe, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{recipe.title}</CardTitle>
                  <CardDescription>
                    Ingredientes: {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : 'Ingredientes não listados'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Modo de Preparo: {recipe.instructions}</p>
                  {recipe.nutritionalInformation && (
                    <p>Informações Nutricionais: {recipe.nutritionalInformation}</p>
                  )}
                  <p>Fonte: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">{recipe.sourceUrl}</a></p>
                </CardContent>
                <div className="p-4 flex justify-end">
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(recipe)}>
                    {isFavorite(recipe) ? <HeartOff className="h-5 w-5 text-red-500" /> : <Heart className="h-5 w-5 text-red-500" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recipes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-orange-500">Receitas Encontradas:</h2>
          <div className="grid gap-4">
            {recipes.map((recipe, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{recipe.title}</CardTitle>
                  <CardDescription>
                    Ingredientes: {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : 'Ingredientes não listados'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Modo de Preparo: {recipe.instructions}</p>
                  {recipe.nutritionalInformation && (
                    <p>Informações Nutricionais: {recipe.nutritionalInformation}</p>
                  )}
                  <p>Fonte: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">{recipe.sourceUrl}</a></p>
                </CardContent>
                <div className="p-4 flex justify-end">
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(recipe)}>
                    {isFavorite(recipe) ? <HeartOff className="h-5 w-5 text-red-500" /> : <Heart className="h-5 w-5 text-red-500" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
