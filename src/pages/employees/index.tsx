import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import { fetchEmployees, type EmployeeRecord } from '../../lib/employees'

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
      return <p style={{ color: '#475569' }}>Loading employees...</p>
    }

    if (error) {
      return (
        <div style={{ color: '#b91c1c' }}>
          <p>{error}</p>
          <button type="button" onClick={() => handlePageChange(page)}>
            Retry
          </button>
        </div>
      )
    }

    if (!records.length) {
      return <p>Tidak ada data karyawan.</p>
    }

    return (
      <>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '0.75rem' }}>Name</th>
              <th style={{ padding: '0.75rem' }}>Department</th>
              <th style={{ padding: '0.75rem' }}>Role</th>
              <th style={{ padding: '0.75rem' }}>Location</th>
              <th style={{ padding: '0.75rem' }}>Photo</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.employeeId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem' }}>{record.fullName || '\u2014'}</td>
                <td style={{ padding: '0.75rem' }}>{record.department || '\u2014'}</td>
                <td style={{ padding: '0.75rem' }}>{record.role || '\u2014'}</td>
                <td style={{ padding: '0.75rem' }}>{record.location || 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>
                  {record.photo ? (
                    <img
                      src={record.photo}
                      alt={record.fullName}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    '\u2014'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={page} limit={limit} total={total} onChange={handlePageChange} />
      </>
    )
  }

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h1>Employees</h1>
        <button
          type="button"
          onClick={handleAddEmployee}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: 999,
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          + Add Employee
        </button>
      </div>

      {renderContent()}
    </section>
  )
}

export default EmployeesPage
