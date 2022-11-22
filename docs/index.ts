import {
  createGrid,
  useCellSelection,
  useColumns,
  useData,
  useLogger,
  useRowSelection
} from '../packages/core/src'
import { Disposable } from '../packages/core/src/lib/config'
import { SortDirection } from '../packages/core/src/lib/config/context'

const dataLength = 1000
const data = Array.from({ length: dataLength }, (_, i) => ({
  accountId: generateNumberBetween(100000, 999999),
  ageOfAccount: generateNumberBetween(1, 100),
  name: `Name ${i}`,
  revenue: generateNumberBetween(1000, 999999) / 100,
  createdDate: generateRandomDate(new Date(2012, 0, 1), new Date()),
  lastRunTime: generateRandomTime(),
  lastRanBy: `User ${generateNumberBetween(1, 100)}`,
  totalTransactions: generateNumberBetween(1, 1000),
}))

function generateRandomTime() {
  return generateNumberBetween(0, 23) + ':' + generateNumberBetween(0, 59)
}

function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

function generateNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


/**
 * Actual Grid Generation
 */

function create() {
  const grid = createGrid(
    useData(data),
    useLogger(),
    useRowSelection(false),
    useCellSelection(),
    useColumns([
      { key: 'accountId', label: 'Account Id', width: 100 },
      { key: 'ageOfAccount', label: 'Account Age', width: 50 },
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
      {
        key: 'createdDate',
        label: 'Created Date',
        width: 100,
        valueGetter: (row) => row.toLocaleDateString(),
      },
      { key: 'lastRunTime', label: 'Last Run Time', width: 100 },
      { key: 'lastRanBy', label: 'Last Ran By', width: 100 },
      { key: 'totalTransactions', label: 'Total Transactions', width: 100 },
    ])
  )
  
  return grid({
    container: document.getElementById('grid'),
  })
}

let createdGrid: Disposable | undefined = create()

const destroyEl = document.getElementById('destroy') as HTMLButtonElement
const createEl = document.getElementById('create') as HTMLButtonElement
destroyEl.onclick = () => {
  createdGrid?.destroy()
  createdGrid = undefined
}
createEl.onclick = () => {
  createdGrid?.destroy()
  createdGrid = create()
}