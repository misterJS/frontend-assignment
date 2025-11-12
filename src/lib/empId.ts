export const makeEmpId = (deptName: string, existingCount: number) => {
  if (!deptName) return ''

  const prefix = deptName
    .replace(/[^A-Za-z]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
    .padEnd(3, 'X')
    .slice(0, 3)

  const numberPart = (existingCount + 1).toString().padStart(3, '0')

  return `${prefix}-${numberPart}`
}
