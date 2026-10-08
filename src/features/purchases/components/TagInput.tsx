import { useMemo, type KeyboardEvent } from 'react'
import { Icon } from '../../../components/ui'
import { useInstallments } from '../../../context/installments'
import { allTags } from '../../../services/purchases'

/** Most suggestions shown under the tag box. */
const MAX_SUGGESTIONS = 10

interface TagInputProps {
  tags: string[]
  /** Text typed but not yet turned into a tag. */
  draft: string
  onDraftChange: (draft: string) => void
  onAdd: (tag: string) => void
  onRemove: (index: number) => void
}

/** Tag chips with a text box (Enter or comma adds) and suggestions. */
export function TagInput({
  tags,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
}: TagInputProps) {
  const { purchases } = useInstallments().state
  const suggestions = useMemo(() => {
    const current = new Set(tags.map((t) => t.toLowerCase()))
    return allTags(purchases)
      .filter((t) => !current.has(t.toLowerCase()))
      .slice(0, MAX_SUGGESTIONS)
  }, [purchases, tags])

  const commitDraft = () => {
    if (draft.trim()) onAdd(draft)
    onDraftChange('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commitDraft()
    } else if (event.key === 'Backspace' && !draft && tags.length) {
      onRemove(tags.length - 1)
    }
  }

  return (
    <div className="field">
      <span>Tags</span>
      <div className="tagbox">
        {tags.map((tag, i) => (
          <span key={tag} className="tchip">
            {tag}
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => onRemove(i)}
            >
              <Icon name="close" size={12} strokeWidth={2.4} />
            </button>
          </span>
        ))}
        <input
          placeholder="Type a tag and press Enter"
          autoComplete="off"
          aria-label="Add a tag"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && commitDraft()}
        />
      </div>
      <div className="chips sugg">
        {suggestions.map((tag) => (
          <button
            key={tag}
            type="button"
            className="chip"
            onClick={() => onAdd(tag)}
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
