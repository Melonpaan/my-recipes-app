import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../ipc/api'
import { useToast } from '../../../components/Toaster'
import type { RecipesCreateRequest } from '../../../../shared/ipc'

export function useRecipesQuery(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: ['recipes', search, categoryId],
    queryFn: () => api.recipes.list({ page: 1, pageSize: 50, search, categoryId }),
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

