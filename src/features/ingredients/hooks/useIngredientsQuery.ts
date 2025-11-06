import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../ipc/api'
import { useToast } from '../../../components/Toaster'
import type { IngredientCreateRequest, IngredientUpdateRequest } from '../../../../shared/ipc'

export function useIngredientsQuery(search?: string) {
  return useQuery({
    queryKey: ['ingredients', search],
    queryFn: () => api.ingredients.list({ page: 1, pageSize: 50, search: search || undefined }),
  })
}

export function useUnitsQuery() {
  return useQuery({
    queryKey: ['units'],
    queryFn: () => api.units.list({ page: 1, pageSize: 100 }),
    staleTime: 1000 * 60 * 10, // 10 minutes - units change rarely
  })
}

export function useIngredientUsageQuery(id: string) {
  return useQuery({
    queryKey: ['ingredient-usage', id],
    queryFn: () => api.ingredients.usage({ id }),
    enabled: false, // Manual trigger only
  })
}

export function useCreateIngredient() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: IngredientCreateRequest) => api.ingredients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast.success('Created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create ingredient')
    },
  })
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: IngredientUpdateRequest) => api.ingredients.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast.success('Updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update ingredient')
    },
  })
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      // Check usage first
      const usage = await api.ingredients.usage({ id })
      if (usage.count > 0) {
        throw new Error(`Used by ${usage.count} recipe(s)`)
      }
      return api.ingredients.delete({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast.success('Deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete ingredient')
    },
  })
}

