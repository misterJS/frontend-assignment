interface PaginationProps {
  page: number
  limit: number
  total: number
  onChange: (nextPage: number) => void
}

const Pagination = ({ page, limit, total, onChange }: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginTop: '1rem',
      }}
    >
      <button
        type="button"
        onClick={() => canPrev && onChange(page - 1)}
        disabled={!canPrev}
        style={{
          padding: '0.4rem 1rem',
          borderRadius: 999,
          border: '1px solid #cbd5f5',
          backgroundColor: canPrev ? '#fff' : '#f1f5f9',
          color: canPrev ? '#0f172a' : '#94a3b8',
          cursor: canPrev ? 'pointer' : 'not-allowed',
        }}
      >
        Prev
      </button>

      <span style={{ fontSize: '0.9rem', color: '#475569' }}>
        Page {page} of {totalPages} ({total} total)
      </span>

      <button
        type="button"
        onClick={() => canNext && onChange(page + 1)}
        disabled={!canNext}
        style={{
          padding: '0.4rem 1rem',
          borderRadius: 999,
          border: '1px solid #cbd5f5',
          backgroundColor: canNext ? '#fff' : '#f1f5f9',
          color: canNext ? '#0f172a' : '#94a3b8',
          cursor: canNext ? 'pointer' : 'not-allowed',
        }}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
