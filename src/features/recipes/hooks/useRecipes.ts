import { useMemo, useState } from 'react'
import { useRecipesQuery, useRecipeQuery, useCreateRecipe, useUpdateRecipe, useDeleteRecipe, useSetRecipeIngredients } from './useRecipesQuery'
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery'
import { useIngredientsQuery, useUnitsQuery } from '../../ingredients/hooks/useIngredientsQuery'
import { useToast } from '../../../components/Toaster'
import { useSearch } from '../../../hooks/useSearch'

type FormData = {
  title: string
  description: string
  prepTime: number | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  categoryId: string
}

export function useRecipes() {
  const { search, debouncedSearch, handleSearchChange, handleSearchSubmit, handleSearchReset: baseSearchReset } = useSearch({ 
    useDebounce: true 
  })

  const [categoryFilter, setCategoryFilter] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    prepTime: null,
    difficulty: null,
    categoryId: '',
  })

  const [ingredientsModalOpen, setIngredientsModalOpen] = useState(false)
  const [managingRecipeId, setManagingRecipeId] = useState<string | null>(null)

  const { data: recipesData, isLoading: isLoadingRecipes } = useRecipesQuery(debouncedSearch, categoryFilter)
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
  const categories = useMemo(() => categoriesData ?? [], [categoriesData])
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

  function validateRecipeForm(): { isValid: boolean; categoryId?: string } {
    if (!form.title.trim()) {
      toast.error('Le titre est requis')
      return { isValid: false }
    }

    const categoryId = form.categoryId || categories[0]?.id
    if (!categoryId) {
      toast.error('Veuillez sélectionner une catégorie')
      return { isValid: false }
    }

    return { isValid: true, categoryId }
  }

  function handleSubmit() {
    const validation = validateRecipeForm()
    if (!validation.isValid) return

    createMutation.mutate(
      {
        title: form.title.trim(),
        description: form.description || '',
        prepTime: form.prepTime,
        difficulty: form.difficulty,
        categoryId: validation.categoryId!,
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
    const validation = validateRecipeForm()
    if (!validation.isValid) return

    updateMutation.mutate({
      id,
      title: form.title.trim(),
      description: form.description || '',
      prepTime: form.prepTime,
      difficulty: form.difficulty,
      categoryId: validation.categoryId!,
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

  function handleCategoryChange(value: string) {
    setCategoryFilter(value)
  }

  function handleSearchReset() {
    baseSearchReset()
    setCategoryFilter('')
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
    search,
    categoryFilter,

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
    handleSearchChange,
    handleSearchSubmit,
    handleSearchReset,
    handleCategoryChange,
  }
}

