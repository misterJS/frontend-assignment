import axios from 'axios'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'

export interface AutocompleteOption {
  id: number | string
  name: string
  [key: string]: unknown
}

interface AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> {
  endpoint: string
  value?: T | null
  placeholder?: string
  minChars?: number
  debounceMs?: number
  disabled?: boolean
  onSelect: (option: T) => void
}

const popupStyle = {
  position: 'absolute' as const,
  inset: 'calc(100% + 4px) 0 auto 0',
  backgroundColor: '#fff',
  border: '1px solid #cbd5f5',
  borderRadius: 8,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
  zIndex: 10,
  maxHeight: 240,
  overflowY: 'auto' as const,
}

const Autocomplete = <T extends AutocompleteOption>({
  endpoint,
  value = null,
  placeholder = 'Cari nama...',
  minChars = 1,
  debounceMs = 300,
  disabled = false,
  onSelect,
}: AutocompleteProps<T>) => {
  const [inputValue, setInputValue] = useState(value?.name ?? '')
  const [options, setOptions] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const trimmedInput = inputValue.trim()

  useEffect(() => {
    setInputValue(value?.name ?? '')
  }, [value?.name])

  useEffect(() => {
    if (!trimmedInput || trimmedInput.length < minChars) {
      setOptions([])
      setIsOpen(false)
      abortControllerRef.current?.abort()
      return
    }

    const timeoutId = window.setTimeout(async () => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller
      setIsLoading(true)

      try {
        const response = await axios.get<T[]>(endpoint, {
          params: {
            name_like: trimmedInput,
          },
          signal: controller.signal,
        })
        setOptions(response.data)
        setIsOpen(response.data.length > 0)
        setHighlightedIndex(response.data.length ? 0 : -1)
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
  }, [debounceMs, endpoint, minChars, trimmedInput])

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
    setIsOpen(false)
  }

  const handleSelect = (option: T) => {
    setInputValue(option.name)
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
    () => (highlightedIndex >= 0 ? `autocomplete-option-${highlightedIndex}` : ''),
    [highlightedIndex],
  )

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
      aria-expanded={isOpen}
    >
      <input
        type="text"
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
        aria-controls="autocomplete-options"
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          borderRadius: 6,
          border: '1px solid #cbd5f5',
          fontSize: '1rem',
        }}
      />

      {isOpen && options.length > 0 && (
        <ul
          id="autocomplete-options"
          style={popupStyle}
          role="listbox"
          aria-label="Autocomplete suggestions"
        >
          {options.map((option, index) => {
            const isActive = index === highlightedIndex
            return (
              <li
                id={`autocomplete-option-${index}`}
                key={option.id}
                role="option"
                aria-selected={isActive}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#fff' : '#0f172a',
                }}
              >
                {option.name}
              </li>
            )
          })}
        </ul>
      )}

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 12,
            transform: 'translateY(-50%)',
            fontSize: '0.85rem',
            color: '#94a3b8',
          }}
        >
          Loading...
        </div>
      )}
    </div>
  )
}

export default Autocomplete
