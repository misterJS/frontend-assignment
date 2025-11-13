import axios from 'axios'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'

export interface AutocompleteOption {
  id: number | string
  [key: string]: unknown
}

interface AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> {
  endpoint: string
  value?: T | null
  placeholder?: string
  minChars?: number
  debounceMs?: number
  disabled?: boolean
  searchField?: string
  getOptionLabel?: (option: T) => string
  onSelect: (option: T) => void
}

const Autocomplete = <T extends AutocompleteOption>({
  endpoint,
  value = null,
  placeholder = 'Cari nama...',
  minChars = 1,
  debounceMs = 300,
  disabled = false,
  searchField = 'name',
  getOptionLabel,
  onSelect,
}: AutocompleteProps<T>) => {
  const deriveLabel = useCallback(
    (option: T | null) => {
      if (!option) return ''
      if (getOptionLabel) return getOptionLabel(option)
      const label = (option as AutocompleteOption & { name?: string }).name
      return typeof label === 'string' ? label : ''
    },
    [getOptionLabel],
  )

  const [inputValue, setInputValue] = useState(deriveLabel(value))
  const [options, setOptions] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const listboxId = useId()
  const skipFetchRef = useRef(false)

  const trimmedInput = inputValue.trim()
  const hasQuery = trimmedInput.length >= minChars

  useEffect(() => {
    setInputValue(deriveLabel(value))
  }, [deriveLabel, value])

  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false
      return
    }

    if (!hasQuery) {
      setOptions([])
      setIsOpen(false)
      setHighlightedIndex(-1)
      abortControllerRef.current?.abort()
      return
    }

    setIsOpen(true)
    const timeoutId = window.setTimeout(async () => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller
      setIsLoading(true)

      try {
        const normalizedQuery = trimmedInput.toLowerCase()
        const response = await axios.get<T[]>(endpoint, {
          params: {
            [`${searchField}_like`]: trimmedInput,
          },
          signal: controller.signal,
        })
        const filtered =
          normalizedQuery.length === 0
            ? response.data
            : response.data.filter((option) => {
                const label = deriveLabel(option)
                return label
                  ?.toLowerCase()
                  .includes(normalizedQuery)
              })
        setOptions(filtered)
        setHighlightedIndex(filtered.length ? 0 : -1)
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Autocomplete fetch failed:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => {
      window.clearTimeout(timeoutId)
      abortControllerRef.current?.abort()
    }
  }, [debounceMs, endpoint, hasQuery, minChars, searchField, trimmedInput])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    if (!event.target.value || event.target.value.length < minChars) {
      setIsOpen(false)
    }
  }

  const handleSelect = (option: T) => {
    skipFetchRef.current = true
    setInputValue(deriveLabel(option))
    setIsOpen(false)
    setOptions([])
    setHighlightedIndex(-1)
    onSelect(option)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !options.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : prev,
      )
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = options[highlightedIndex]
      if (option) {
        handleSelect(option)
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const optionId = useMemo(
    () => (highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : ''),
    [highlightedIndex, listboxId],
  )

  const showEmptyState = !isLoading && hasQuery && options.length === 0

  return (
    <div
      ref={containerRef}
      className="autocomplete"
      aria-expanded={isOpen}
    >
      <input
        type="text"
        className="autocomplete__input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (options.length) {
            setIsOpen(true)
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        aria-autocomplete="list"
        aria-activedescendant={optionId || undefined}
        aria-controls={listboxId}
      />

      {isOpen && (
        <ul
          id={listboxId}
          className="autocomplete__list"
          role="listbox"
          aria-label="Autocomplete suggestions"
        >
          {isLoading && (
            <li className="autocomplete__option autocomplete__option--muted">
              Loading...
            </li>
          )}

          {!isLoading && options.length > 0
            ? options.map((option, index) => {
                const isActive = index === highlightedIndex
                const label = deriveLabel(option)
                return (
                  <li
                    id={`${listboxId}-option-${index}`}
                    key={option.id}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(option)}
                    className={`autocomplete__option${
                      isActive ? ' autocomplete__option--active' : ''
                    }`}
                  >
                    {label || '(No label)'}
                  </li>
                )
              })
            : null}

          {showEmptyState && (
            <li className="autocomplete__option autocomplete__option--muted">
              Tidak ada hasil
            </li>
          )}
        </ul>
      )}

      {isLoading && !isOpen && (
        <div className="autocomplete__status">Loading...</div>
      )}
    </div>
  )
}

export default Autocomplete
