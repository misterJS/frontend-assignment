import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Pagination from '@/components/Pagination'
import { fetchEmployees, type EmployeeRecord } from '@/lib/employees'

const DEFAULT_LIMIT = 5

const EmployeesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const page = Number(searchParams.get('_page')) || 1
  const limit = Number(searchParams.get('_limit')) || DEFAULT_LIMIT

  const [records, setRecords] = useState<EmployeeRecord[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryParams = useMemo(
    () => ({
      page,
      limit,
    }),
    [limit, page],
  )

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await fetchEmployees(queryParams)
        setRecords(result.data)
        setTotal(result.total)
      } catch (loadError) {
        console.error('Failed to fetch employees', loadError)
        setError('Gagal memuat data karyawan.')
      } finally {
        setIsLoading(false)
      }
    }

    loadEmployees()
  }, [queryParams])

  const handlePageChange = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('_page', nextPage.toString())
    nextParams.set('_limit', limit.toString())
    setSearchParams(nextParams)
  }

  const handleAddEmployee = () => {
    navigate('/wizard')
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="state state--muted">Loading employees...</div>
    }

    if (error) {
      return (
        <div className="state state--error">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => handlePageChange(page)}
            className="btn btn--danger btn--xs"
          >
            Retry
          </button>
        </div>
      )
    }

    if (!records.length) {
      return <div className="state state--muted">Tidak ada data karyawan.</div>
    }

    return (
      <>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Location</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.employeeId}>
                  <td>{record.fullName || '\u2014'}</td>
                  <td>{record.department || '\u2014'}</td>
                  <td>{record.role || '\u2014'}</td>
                  <td>{record.location || 'N/A'}</td>
                  <td>
                    {record.photo ? (
                      <img
                        src={record.photo}
                        alt={record.fullName}
                        className="table__photo"
                      />
                    ) : (
                      '\u2014'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} limit={limit} total={total} onChange={handlePageChange} />
      </>
    )
  }

  return (
    <section className="employees">
      <div className="employees__header">
        <h1 className="employees__title">Employees</h1>
        <button type="button" onClick={handleAddEmployee} className="btn btn--primary">
          + Add Employee
        </button>
      </div>

      {renderContent()}
    </section>
  )
}

export default EmployeesPage
