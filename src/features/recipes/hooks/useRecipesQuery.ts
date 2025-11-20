import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../ipc/api'
import { useToast } from '../../../components/Toaster'
import { getErrorMessage } from '../../../utils/errorUtils'
import type { RecipesCreateRequest, RecipesUpdateRequest, RecipesDeleteRequest, RecipeIngredientsSetRequest } from '../../../../shared/ipc'

export function useRecipesQuery(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: ['recipes', search || '', categoryId || ''],
    queryFn: () => api.recipes.list({ page: 1, pageSize: 50, search, categoryId }),
    refetchOnMount: true,
  })
}

export function useRecipeQuery(id: string | null) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => api.recipes.get({ id: id! }),
    enabled: !!id, // Only run query if id is not null
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: RecipesCreateRequest) => api.recipes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recette créée avec succès')
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
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
      toast.success('Recette modifiée avec succès')
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (data: RecipesDeleteRequest) => api.recipes.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recette supprimée avec succès')
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
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
      toast.success('Ingrédients mis à jour avec succès')
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

