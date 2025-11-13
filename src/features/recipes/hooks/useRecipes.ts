import { useMemo, useState } from 'react'
import { useRecipesQuery, useRecipeQuery, useCategoriesQuery, useCreateRecipe, useUpdateRecipe, useDeleteRecipe, useSetRecipeIngredients } from './useRecipesQuery'
import { useIngredientsQuery, useUnitsQuery } from '../../ingredients/hooks/useIngredientsQuery'
import { useToast } from '../../../components/Toaster'

type FormData = {
  title: string
  description: string
  prepTime: number | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  categoryId: string
}

export function useRecipes() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    prepTime: null,
    difficulty: null,
    categoryId: '',
  })

  // Manage ingredients modal state
  const [ingredientsModalOpen, setIngredientsModalOpen] = useState(false)
  const [managingRecipeId, setManagingRecipeId] = useState<string | null>(null)

  // React Query hooks
  const { data: recipesData, isLoading: isLoadingRecipes } = useRecipesQuery()
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategoriesQuery()
  const { data: ingredientsData, isLoading: isLoadingIngredients } = useIngredientsQuery()
  const { data: unitsData, isLoading: isLoadingUnits } = useUnitsQuery()
  const { data: managingRecipe } = useRecipeQuery(managingRecipeId)
  const createMutation = useCreateRecipe()
  const updateMutation = useUpdateRecipe()
  const deleteMutation = useDeleteRecipe()
  const setIngredientsMutation = useSetRecipeIngredients()
  const toast = useToast()

  const recipes = useMemo(() => recipesData?.items ?? [], [recipesData])
  const categories = useMemo(() => categoriesData?.items ?? [], [categoriesData])
  const ingredients = useMemo(() => ingredientsData?.items ?? [], [ingredientsData])
  const units = useMemo(() => unitsData?.items ?? [], [unitsData])
  const loading = isLoadingRecipes || isLoadingCategories || isLoadingIngredients || isLoadingUnits

  const unitIdToCode = useMemo(() => {
    const map = new Map<string, string>()
    units.forEach((u) => map.set(u.id, u.code))
    return map
  }, [units])

  function openCreateForm() {
    setForm({
      title: '',
      description: '',
      prepTime: null,
      difficulty: null,
      categoryId: categories[0]?.id ?? '',
    })
    setEditingId(null)
    setFormOpen(true)
  }

  function closeForm() {
    setEditingId(null)
    setFormOpen(false)
  }

  function handleSubmit() {
    // Basic validation
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }

    const categoryId = form.categoryId || categories[0]?.id
    if (!categoryId) {
      toast.error('Please select a category')
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
    setEditingId(id)
    setFormOpen(true)
  }

  function handleUpdate(id: string) {
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    const categoryId = form.categoryId || categories[0]?.id
    if (!categoryId) {
      toast.error('Please select a category')
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

  function handleManageIngredients(id: string) {
    setManagingRecipeId(id)
    setIngredientsModalOpen(true)
  }

  function closeIngredientsModal() {
    setIngredientsModalOpen(false)
    setManagingRecipeId(null)
  }

  function handleSaveIngredients(ingredientsPayload: Array<{ ingredientId: string; quantity: number }>) {
    if (!managingRecipeId) return
    setIngredientsMutation.mutate(
      { recipeId: managingRecipeId, ingredients: ingredientsPayload },
      { onSuccess: () => closeIngredientsModal() }
    )
  }

  return {
    // State
    recipes,
    categories,
    ingredients,
    units,
    unitIdToCode,
    loading,
    formOpen,
    form,
    editingId,
    ingredientsModalOpen,
    managingRecipe,

    // Actions
    setForm,
    setEditingId,
    openCreateForm,
    closeForm,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleUpdate,
    handleManageIngredients,
    closeIngredientsModal,
    handleSaveIngredients,
  }
}

