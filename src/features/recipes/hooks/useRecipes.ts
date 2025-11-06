import { useMemo, useState } from 'react'
import { useRecipesQuery, useCategoriesQuery, useCreateRecipe } from './useRecipesQuery'

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
  }
}

