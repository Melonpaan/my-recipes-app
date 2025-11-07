import { useMemo, useState } from 'react'
import { useRecipesQuery, useCategoriesQuery, useCreateRecipe, useUpdateRecipe, useDeleteRecipe } from './useRecipesQuery'

type FormData = {
  title: string
  description: string
  prepTime: number | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  categoryId: string
}

export function useRecipes() {
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    prepTime: null,
    difficulty: null,
    categoryId: '',
  })

  // React Query hooks
  const { data: recipesData, isLoading: isLoadingRecipes } = useRecipesQuery()
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategoriesQuery()
  const createMutation = useCreateRecipe()
  const updateMutation = useUpdateRecipe()
  const deleteMutation = useDeleteRecipe()

  const recipes = useMemo(() => recipesData?.items ?? [], [recipesData])
  const categories = useMemo(() => categoriesData?.items ?? [], [categoriesData])
  const loading = isLoadingRecipes || isLoadingCategories

  function openCreateForm() {
    setForm({
      title: '',
      description: '',
      prepTime: null,
      difficulty: null,
      categoryId: categories[0]?.id ?? '',
    })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  function handleSubmit() {
    // Basic validation
    if (!form.title.trim()) {
      alert('Title is required')
      return
    }

    const categoryId = form.categoryId || categories[0]?.id
    if (!categoryId) {
      alert('Please select a category')
      return
    }

    createMutation.mutate(
      {
        title: form.title.trim(),
        description: form.description || '',
        prepTime: form.prepTime,
        difficulty: form.difficulty,
        categoryId,
        userId: null,
      },
      {
        onSuccess: () => setFormOpen(false),
      }
    )
  }

  function handleDelete(id: string) {
    deleteMutation.mutate({ id })
  }

  function handleEdit(id: string) {
    const r = recipes.find((x) => x.id === id)
    if (!r) return
    setForm({
      title: r.title,
      description: r.description || '',
      prepTime: r.prepTime ?? null,
      difficulty: r.difficulty ?? null,
      categoryId: r.categoryId,
    })
    setFormOpen(true)
  }

  function handleUpdate(id: string) {
    if (!form.title.trim()) {
      alert('Title is required')
      return
    }
    const categoryId = form.categoryId || categories[0]?.id
    if (!categoryId) {
      alert('Please select a category')
      return
    }
    updateMutation.mutate({
      id,
      title: form.title.trim(),
      description: form.description || '',
      prepTime: form.prepTime,
      difficulty: form.difficulty,
      categoryId,
      userId: null,
    }, {
      onSuccess: () => setFormOpen(false),
    })
  }

  return {
    // State
    recipes,
    categories,
    loading,
    formOpen,
    form,

    // Actions
    setForm,
    openCreateForm,
    closeForm,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleUpdate,
  }
}

