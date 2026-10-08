import { useRef, useState, type FormEvent } from 'react'
import { ConfirmButton, SheetContent } from '../../../components/ui'
import { useInstallments } from '../../../context/installments'
import { useToast } from '../../../context/toast'
import { useUi } from '../../../context/ui'
import { useDelayedFocus } from '../../../hooks/useDelayedFocus'
import { useMoney } from '../../../hooks/useMoney'
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_INSTALLMENTS,
  MAX_TAG_LENGTH,
  MAX_TAGS,
  cleanTags,
} from '../../../services/normalize'
import { describeSchedule } from '../../../services/schedule'
import { isDateKey, todayKey } from '../../../utils/date'
import { parseAmount, roundMoney } from '../../../utils/number'
import { cx } from '../../../utils/style'
import { TagInput } from '../components/TagInput'

const PRESET_COUNTS = [3, 6, 9, 12, 18, 24]
const DEFAULT_COUNT = 12

type Field = 'description' | 'amount' | 'date' | 'installments'

/** Adds a tag unless it is empty, repeated (any case) or over the limit. */
const withTag = (tags: string[], value: string): string[] => {
  const tag = value.replace(/,/g, '').trim().slice(0, MAX_TAG_LENGTH)
  if (!tag || tags.length >= MAX_TAGS) return tags
  if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return tags
  return [...tags, tag]
}

/** Creates a purchase, or edits one when `purchaseId` exists. */
export function PurchaseSheet({ purchaseId }: { purchaseId: string | null }) {
  const { state, actions } = useInstallments()
  const { closeSheet } = useUi()
  const { showToast } = useToast()
  const money = useMoney()
  const purchase = purchaseId
    ? state.purchases.find((p) => p.id === purchaseId)
    : undefined

  const [description, setDescription] = useState(purchase?.description ?? '')
  const [amount, setAmount] = useState(purchase?.amount.toFixed(2) ?? '')
  const [date, setDate] = useState(purchase?.date ?? todayKey())
  const [count, setCount] = useState(
    String(purchase?.installments ?? DEFAULT_COUNT),
  )
  const [tags, setTags] = useState(purchase?.tags ?? [])
  const [tagDraft, setTagDraft] = useState('')
  const [invalid, setInvalid] = useState<Set<Field>>(new Set())
  const [error, setError] = useState('')

  const descriptionRef = useRef<HTMLInputElement>(null)
  useDelayedFocus(descriptionRef, !purchase)

  const n = parseInt(count, 10)
  const preview = describeSchedule(
    { amount: parseAmount(amount), installments: n, date },
    money.format,
  )

  const edit =
    (field: Field, set: (value: string) => void) => (value: string) => {
      set(value)
      setInvalid((current) => {
        if (!current.has(field)) return current
        const next = new Set(current)
        next.delete(field)
        return next
      })
    }

  const save = (event: FormEvent) => {
    event.preventDefault()
    const finalTags = tagDraft.trim() ? withTag(tags, tagDraft) : tags
    setTags(finalTags)
    setTagDraft('')

    const desc = description.trim()
    const value = parseAmount(amount)
    const errors: string[] = []
    const bad = new Set<Field>()
    if (!desc) {
      errors.push('Add a description.')
      bad.add('description')
    }
    if (!(value > 0)) {
      errors.push('Enter an amount greater than 0.')
      bad.add('amount')
    }
    if (!isDateKey(date)) {
      errors.push('Pick a purchase date.')
      bad.add('date')
    }
    if (!(n >= 1 && n <= MAX_INSTALLMENTS)) {
      errors.push(`Use between 1 and ${MAX_INSTALLMENTS} payments.`)
      bad.add('installments')
    }
    setInvalid(bad)
    setError(errors.join(' '))
    if (errors.length) return

    const input = {
      description: desc.slice(0, MAX_DESCRIPTION_LENGTH),
      amount: roundMoney(value),
      date,
      installments: n,
      tags: cleanTags(finalTags),
    }
    if (purchase) actions.updatePurchase(purchase.id, input)
    else actions.addPurchase(input)
    closeSheet()
    showToast(purchase ? 'Changes saved' : 'Purchase added')
  }

  const remove = () => {
    if (!purchase) return
    const index = state.purchases.findIndex((p) => p.id === purchase.id)
    actions.deletePurchase(purchase.id)
    closeSheet()
    showToast('Purchase deleted', {
      label: 'Undo',
      run: () => actions.restorePurchase(purchase, index),
    })
  }

  return (
    <SheetContent
      title={purchase ? 'Edit purchase' : 'New purchase'}
      onClose={closeSheet}
    >
      <form onSubmit={save} noValidate>
        <label className="field">
          <span>Description</span>
          <input
            ref={descriptionRef}
            className={cx(invalid.has('description') && 'bad')}
            maxLength={MAX_DESCRIPTION_LENGTH}
            autoComplete="off"
            placeholder="e.g. New phone"
            value={description}
            onChange={(e) =>
              edit('description', setDescription)(e.target.value)
            }
          />
        </label>
        <div className="two">
          <label className="field">
            <span>Total amount</span>
            <input
              className={cx(invalid.has('amount') && 'bad')}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={amount}
              onChange={(e) => edit('amount', setAmount)(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Purchase date</span>
            <input
              className={cx(invalid.has('date') && 'bad')}
              type="date"
              value={date}
              onChange={(e) => edit('date', setDate)(e.target.value)}
            />
          </label>
        </div>
        <div className="field">
          <span id="purchase-n-label">Number of payments</span>
          <div className="n-row">
            <div
              className="chips"
              role="group"
              aria-labelledby="purchase-n-label"
            >
              {PRESET_COUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="chip"
                  aria-pressed={preset === n}
                  onClick={() => edit('installments', setCount)(String(preset))}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              className={cx(invalid.has('installments') && 'bad')}
              inputMode="numeric"
              aria-label="Number of payments"
              maxLength={3}
              value={count}
              onChange={(e) => edit('installments', setCount)(e.target.value)}
            />
          </div>
        </div>
        <TagInput
          tags={tags}
          draft={tagDraft}
          onDraftChange={setTagDraft}
          onAdd={(tag) => setTags((current) => withTag(current, tag))}
          onRemove={(index) =>
            setTags((current) => current.filter((_, i) => i !== index))
          }
        />
        <p className="preview" aria-live="polite">
          {preview}
        </p>
        <p className="err" role="alert">
          {error}
        </p>
        <div className="btns">
          <button type="submit" className="btn primary">
            {purchase ? 'Save changes' : 'Add purchase'}
          </button>
          {purchase && (
            <ConfirmButton
              className="btn danger"
              confirmLabel="Tap again to delete"
              onConfirm={remove}
            >
              Delete purchase
            </ConfirmButton>
          )}
        </div>
      </form>
    </SheetContent>
  )
}
