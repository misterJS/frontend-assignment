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
    <div className="pagination">
      <button
        type="button"
        onClick={() => canPrev && onChange(page - 1)}
        disabled={!canPrev}
        className="btn btn--ghost"
      >
        Prev
      </button>

      <span className="pagination__info">
        Page {page} of {totalPages} ({total} total)
      </span>

      <button
        type="button"
        onClick={() => canNext && onChange(page + 1)}
        disabled={!canNext}
        className="btn btn--ghost"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
