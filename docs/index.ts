import {
  createGrid,
  useColumns,
  useData,
  useLogger,
} from '../packages/core/src'
import { SortDirection } from '../packages/core/src/lib/context'

const dataLength = 1000
const data = Array.from({ length: dataLength }, (_, i) => ({
  accountId: generateNumberBetween(100000, 999999),
  ageOfAccount: generateNumberBetween(1, 100),
  name: `Name ${i}`,
  revenue: generateNumberBetween(1000, 999999) / 100,
}))

function generateNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const grid = createGrid(
  useData(data),
  useLogger(),
  useColumns([
    { key: 'accountId', label: 'Account Id', width: 100 },
    { key: 'ageOfAccount', label: 'Account Age', width: 100 },
    {
      key: 'name',
      label: 'Name',
      width: 100,
      sortFunction: (a, b, sortDirection) => {
        const aNum = Number(a.data.replace('Name ', ''))
        const bNum = Number(b.data.replace('Name ', ''))
        const direction = sortDirection === SortDirection.Ascending ? -1 : 1
        return (aNum - bNum) * direction
      },
    },
    {
      key: 'revenue',
      label: 'Revenue',
      width: 100,
      valueGetter: (row) => `$${row.toFixed(2)}`,
    },
  ])
)

grid({
  container: document.getElementById('grid'),
})
