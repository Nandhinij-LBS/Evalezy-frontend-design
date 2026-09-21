import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import GoalLibraryModal from '../components/GoalLibraryModal'
import HomeIndicator from '../components/HomeIndicator'
import RichTextEditor from '../components/RichTextEditor'
import StatusBarMock from '../components/StatusBarMock'
import { createGoal, deleteGoal, fetchGoalLibrary, getCurrentUser, getGoalById, updateGoal } from '../services/api'
import type { Goal, LibraryGoal, Milestone } from '../types'
import { hasGoalValidationErrors, hasTextContent, normalizeMilestones, validateGoal, type GoalValidationErrors } from '../utils/goalValidation'

const categories = ['Functional', 'Behavioral', 'Leadership']
const defaultGoalDescription = 'Define a clear, measurable goal that supports the employee\'s responsibilities and professional growth.'

export default function AddGoalPage() {
  const navigate = useNavigate()
  const { goalId } = useParams()
  const isEdit = Boolean(goalId)

  const [library, setLibrary] = useState<LibraryGoal[]>([])
  const [showLibrary, setShowLibrary] = useState(false)
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState(isEdit ? '' : defaultGoalDescription)
  const [category, setCategory] = useState(categories[0])
  const [weight, setWeight] = useState(25)
  const [dueDate, setDueDate] = useState('')
  const [threshold50, setThreshold50] = useState('')
  const [target100, setTarget100] = useState('')
  const [superior150, setSuperior150] = useState('')
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(Boolean(goalId))
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<GoalValidationErrors>({})

  const clearFieldError = (field: keyof GoalValidationErrors) => {
    setFieldErrors((errors) => {
      if (!errors[field]) return errors
      const next = { ...errors }
      delete next[field]
      return next
    })
  }

  useEffect(() => {
    fetchGoalLibrary()
      .then(setLibrary)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load goal library'))
  }, [])

  useEffect(() => {
    if (!goalId) return
    getGoalById(goalId)
      .then((g) => {
        if (!g) throw new Error('Goal not found')
        setTitle(g.title)
        setDescription(g.description ?? '')
        setCategory(g.category)
        setWeight(g.weightPercent)
        setDueDate(g.dueDate)
        setThreshold50(g.threshold50)
        setTarget100(g.target100)
        setSuperior150(g.superior150 ?? '')
        setMilestones(g.milestones ?? [])
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load goal'))
      .finally(() => setLoading(false))
  }, [goalId])

  const applyTemplate = (template: LibraryGoal) => {
    setTitle(template.title)
    setDescription(template.description)
    setCategory(template.category)
    setSelectedLibraryId(template.id)
    setFieldErrors({})
    setShowLibrary(false)
  }

  const adjustWeight = (delta: number) => {
    setWeight((w) => Math.min(100, Math.max(0, w + delta)))
  }

  const addMilestone = () => {
    setMilestones((m) => [...m, { id: `m-${Date.now()}`, text: '', done: false }])
  }

  const updateMilestoneText = (id: string, text: string) => {
    setMilestones((m) => m.map((item) => (item.id === id ? { ...item, text } : item)))
    clearFieldError('milestones')
  }

  const removeMilestone = (id: string) => {
    setMilestones((m) => m.filter((item) => item.id !== id))
    clearFieldError('milestones')
  }

  const handleDelete = async () => {
    if (!goalId) return
    const confirmed = window.confirm('Delete this goal? This cannot be undone.')
    if (!confirmed) return
    setDeleting(true)
    setError('')
    try {
      await deleteGoal(goalId)
      navigate('/goals')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete goal')
    } finally {
      setDeleting(false)
    }
  }
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const validationErrors = validateGoal({
      title,
      description,
      category,
      weightPercent: weight,
      dueDate,
      threshold50,
      target100,
      superior150,
      milestones,
    })
    setFieldErrors(validationErrors)
    if (hasGoalValidationErrors(validationErrors)) {
      setError('Please correct the highlighted fields before saving your goal.')
      return
    }

    const savedMilestones = normalizeMilestones(milestones)

    setSaving(true)

    try {
      if (isEdit && goalId) {
        await updateGoal(goalId, {
          title: title.trim(),
          description: description.trim(),
          category,
          weightPercent: weight,
          dueDate,
          threshold50: hasTextContent(threshold50) ? threshold50 : 'Not defined yet.',
          target100: hasTextContent(target100) ? target100 : 'Not defined yet.',
          superior150: hasTextContent(superior150) ? superior150 : 'Not defined yet.',
          milestones: savedMilestones,
        })
        navigate(`/goals/${goalId}`)
        return
      }

      const authenticatedEmployeeId = getCurrentUser()?.id
      if (authenticatedEmployeeId === undefined) {
        throw new Error('Your session has expired. Please sign in again.')
      }

      const newGoal: Omit<Goal, 'id'> = {
        employeeId: String(authenticatedEmployeeId),
        title: title.trim(),
        description: description.trim(),
        category,
        weightPercent: weight,
        dueDate,
        status: 'not-started',
        threshold50: hasTextContent(threshold50) ? threshold50 : 'Not defined yet.',
        target100: hasTextContent(target100) ? target100 : 'Not defined yet.',
        superior150: hasTextContent(superior150) ? superior150 : 'Not defined yet.',
        milestones: savedMilestones,
      }

      await createGoal(newGoal)
      navigate('/goals')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save goal')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <StatusBarMock />
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#F2F4F7] sm:px-5">
        <button
          onClick={() => navigate('/goals')}
          aria-label="Back to Goal List"
          className="w-9 h-9 rounded-full border border-teal-brand/30 flex items-center justify-center text-teal-brand shrink-0"
        >
          <BackArrowIcon />
        </button>
        <h1 className="flex-1 text-base font-bold text-gray-900">{isEdit ? 'Edit Goal' : 'Add Goal'}</h1>
        <Avatar src={getCurrentUser()?.avatarUrl ?? ''} name={getCurrentUser()?.name ?? 'Employee'} className="w-9 h-9 shrink-0" />
      </header>

      <form noValidate onSubmit={handleSubmit} className="flex-1 flex flex-col">
      <div className="flex-1 px-4 pt-4 pb-32 bg-[#F9FAFB] sm:px-5">
        {loading && <p className="text-sm text-gray-400 mb-4">Loading goal...</p>}
        {error && <p role="alert" className="text-sm text-red-600 mb-4">{error}</p>}
        {!isEdit && (
          <>
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              className="w-full min-h-11 flex items-center gap-3 bg-teal-brand text-white rounded-xl px-4 py-3.5"
            >
              <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <BookIcon />
              </span>
              <span className="text-left flex-1">
                <span className="block font-semibold text-sm">Browse Goal Library</span>
                <span className="block text-xs text-white/80">Use predefined goals to save time</span>
              </span>
              <ChevronIcon />
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs font-medium text-gray-400">OR</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
          </>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-800">
              Goal Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) => { setTitle(e.target.value); clearFieldError('title') }}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? 'title-error' : undefined}
              placeholder="Enter goal title"
              className={`w-full mt-1.5 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-brand ${fieldErrors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.title && <p id="title-error" className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">Goal Description</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); clearFieldError('description') }}
              rows={3}
              placeholder="Describe your goal and how you plan to achieve it..."
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={fieldErrors.description ? 'description-error' : undefined}
              className={`w-full mt-1.5 border rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-brand resize-none ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.description && <p id="description-error" className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className="text-sm font-semibold text-gray-800">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); clearFieldError('category') }}
                aria-invalid={Boolean(fieldErrors.category)}
                aria-describedby={fieldErrors.category ? 'category-error' : undefined}
                className={`w-full mt-1.5 border rounded-xl px-3 py-2.5 text-sm text-teal-brand font-medium focus:outline-none focus:ring-2 focus:ring-teal-brand ${fieldErrors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                {(categories.includes(category) ? categories : [category, ...categories]).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {fieldErrors.category && <p id="category-error" className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Weight (%) <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center gap-1 mt-1.5 border rounded-xl px-1 ${fieldErrors.weightPercent ? 'border-red-500' : 'border-gray-300'}`}>
                <button type="button" onClick={() => adjustWeight(-5)} className="w-8 h-9 text-gray-500 text-lg">
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{weight}%</span>
                <button type="button" onClick={() => adjustWeight(5)} className="w-8 h-9 text-gray-500 text-lg">
                  +
                </button>
              </div>
              {fieldErrors.weightPercent && <p id="weight-error" className="mt-1 text-xs text-red-600">{fieldErrors.weightPercent}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">
              Due Date <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                required
                type="date"
                value={dueDate}
                onChange={(e) => { setDueDate(e.target.value); clearFieldError('dueDate') }}
                aria-invalid={Boolean(fieldErrors.dueDate)}
                aria-describedby={fieldErrors.dueDate ? 'due-date-error' : undefined}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-brand ${fieldErrors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {fieldErrors.dueDate && <p id="due-date-error" className="mt-1 text-xs text-red-600">{fieldErrors.dueDate}</p>}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1.5">Goal Description</p>

            <label className="text-sm font-semibold text-gray-800">50% Threshold:</label>
            <RichTextEditor
              value={threshold50}
              onChange={(value) => { setThreshold50(value); clearFieldError('threshold50') }}
              placeholder="Add expectations outlining the minimum acceptable achievement for this goal, list the outcomes needed for success..."
              invalid={Boolean(fieldErrors.threshold50)}
              errorId={fieldErrors.threshold50 ? 'threshold-error' : undefined}
            />
            {fieldErrors.threshold50 && <p id="threshold-error" className="mt-1 text-xs text-red-600">{fieldErrors.threshold50}</p>}

            <label className="text-sm font-semibold text-gray-800 mt-4 block">100% Target:</label>
            <div className="relative">
              <RichTextEditor
                value={target100}
                onChange={(value) => { setTarget100(value); clearFieldError('target100') }}
                placeholder="Add expectations outlining the full and accepted achievement for this goal, list the outcomes needed for success..."
                invalid={Boolean(fieldErrors.target100)}
                errorId={fieldErrors.target100 ? 'target-error' : undefined}
              />
              <button
                type="button"
                aria-label="Add comment on this field"
                className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-teal-brand text-white flex items-center justify-center shadow"
              >
                <SmallCommentPlusIcon />
              </button>
            </div>
            {fieldErrors.target100 && <p id="target-error" className="mt-1 text-xs text-red-600">{fieldErrors.target100}</p>}

            <label className="text-sm font-semibold text-gray-800 mt-4 block">150% Superior:</label>
            <RichTextEditor
              value={superior150}
              onChange={(value) => { setSuperior150(value); clearFieldError('superior150') }}
              placeholder="Add expectations outlining exceptional achievement beyond the goal, list the outcomes that would exceed expectations..."
              invalid={Boolean(fieldErrors.superior150)}
              errorId={fieldErrors.superior150 ? 'superior-error' : undefined}
            />
            {fieldErrors.superior150 && <p id="superior-error" className="mt-1 text-xs text-red-600">{fieldErrors.superior150}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800">Key Results / Milestones</p>
              <button
                type="button"
                onClick={addMilestone}
                className="text-sm font-semibold text-teal-brand flex items-center gap-1"
              >
                <span className="text-base leading-none">+</span> Add New
              </button>
            </div>

            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.id} className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${fieldErrors.milestones ? 'border-red-500' : 'border-gray-200'}`}>
                  <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                  <input
                    value={m.text}
                    onChange={(e) => updateMilestoneText(m.id, e.target.value)}
                    aria-invalid={Boolean(fieldErrors.milestones)}
                    aria-describedby={fieldErrors.milestones ? 'milestones-error' : undefined}
                    placeholder="Define a milestone..."
                    className="flex-1 min-w-0 text-sm text-gray-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeMilestone(m.id)}
                    aria-label="Remove milestone"
                    className="text-red-400 shrink-0"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              {fieldErrors.milestones && <p id="milestones-error" className="text-xs text-red-600">{fieldErrors.milestones}</p>}
              {milestones.length === 0 && (
                <p className="text-xs text-gray-400">No milestones yet. Tap "Add New" to create one.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* bottom-container: Save/Cancel actions + HomeIndicatorContainer */}
      <div className="bg-white border-t border-[#F2F4F7] px-4 pt-3 sm:px-5">
        <button
          type="submit"
          disabled={saving}
          className="w-full min-h-11 bg-teal-brand text-white rounded-full py-3.5 font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Goal'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full text-center text-sm font-semibold text-gray-600 py-3"
        >
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full text-center text-sm font-semibold text-red-600 py-1 disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete Goal'}
          </button>
        )}
        <HomeIndicator />
      </div>
      </form>

      {showLibrary && (
        <GoalLibraryModal
          goals={library}
          selectedId={selectedLibraryId}
          onSelect={applyTemplate}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  )
}

function SmallCommentPlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M12 7v6M9 10h6" />
    </svg>
  )
}
function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}
function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  )
}
function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 shrink-0">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-.8 13.4A2 2 0 0 1 16.2 21H7.8a2 2 0 0 1-2-1.6L5 6" />
    </svg>
  )
}
