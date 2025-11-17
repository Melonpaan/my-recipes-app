import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../ipc/api'
import { useToast } from '../../../components/Toaster'
import { getErrorMessage } from '../../../utils/errorUtils'
import type { CategoryCreateRequest, CategoryUpdateRequest, CategoryDeleteRequest } from '../../../../shared/ipc'

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.categories.list({ page: 1, pageSize: 100 })
      return res.items
    },
    refetchOnMount: true,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: CategoryCreateRequest) => api.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie créée avec succès')
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: CategoryUpdateRequest) => api.categories.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie modifiée avec succès')
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: CategoryDeleteRequest) => api.categories.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie supprimée avec succès')
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

