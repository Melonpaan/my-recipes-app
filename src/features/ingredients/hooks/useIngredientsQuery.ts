import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../ipc/api'
import { useToast } from '../../../components/Toaster'
import { getErrorMessage } from '../../../utils/errorUtils'
import type { IngredientCreateRequest, IngredientUpdateRequest } from '../../../../shared/ipc'

export function useIngredientsQuery(search?: string) {
  return useQuery({
    queryKey: ['ingredients', search || ''],
    queryFn: () => api.ingredients.list({ page: 1, pageSize: 50, search: search || undefined }),
    refetchOnMount: true,
  })
}

export function useUnitsQuery() {
  return useQuery({
    queryKey: ['units'],
    queryFn: () => api.units.list({ page: 1, pageSize: 100 }),
    staleTime: 1000 * 60 * 10, // 10 minutes - units change rarely
  })
}

export function useCreateIngredient() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: IngredientCreateRequest) => api.ingredients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast.success('Ingrédient créé avec succès')
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
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
      toast.success('Ingrédient modifié avec succès')
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id: string) => api.ingredients.delete({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast.success('Ingrédient supprimé avec succès')
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

