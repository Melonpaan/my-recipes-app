import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../ipc/api'
import { useToast } from '../../../components/Toaster'
import type { RecipesCreateRequest, RecipesUpdateRequest, RecipesDeleteRequest, RecipeIngredientsSetRequest } from '../../../../shared/ipc'

export function useRecipesQuery(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: ['recipes', search, categoryId],
    queryFn: () => api.recipes.list({ page: 1, pageSize: 50, search, categoryId }),
  })
}

export function useRecipeQuery(id: string | null) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => api.recipes.get({ id: id! }),
    enabled: !!id, // Only run query if id is not null
  })
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.list({ page: 1, pageSize: 100 }),
    staleTime: 1000 * 60 * 10, // 10 minutes - categories change rarely
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: RecipesCreateRequest) => api.recipes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recipe created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create recipe')
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (data: RecipesUpdateRequest) => api.recipes.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recipe updated')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update recipe'),
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (data: RecipesDeleteRequest) => api.recipes.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recipe deleted')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete recipe'),
  })
}

export function useSetRecipeIngredients() {
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (data: RecipeIngredientsSetRequest) => api.recipes.setIngredients(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.recipeId] })
      toast.success('Ingredients updated')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update ingredients'),
  })
}

