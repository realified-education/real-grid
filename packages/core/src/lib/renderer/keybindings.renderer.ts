import { Disposable, GridConfig } from "../config";
import { GridContext } from "../config/context";
import { GridElement } from "./element";

export function renderKeybindings<T>(
  gridElement: GridElement,
  config: GridConfig<T> & GridContext
): Disposable {
  const callback = (e: Event) => {
    const event = e as KeyboardEvent
    const cmdOrCtrl = event.metaKey || event.ctrlKey
    if (event.key === 'Escape') {
      clearSelection(config)
    }

    if (!cmdOrCtrl) {
      return
    }
    if (event.key === 'c') {
      copyCellValuesToClipboard(config)
    }
  }
  document.addEventListener('keydown', callback)

  return {
    destroy() {
      document.removeEventListener('keydown', callback)
    },
  }
}

function copyCellValuesToClipboard<T>(
  config: GridConfig<T> & GridContext
) {
  if ((config.cellSelection?.selectedCells?.length ?? 0) === 0) {
    return
  }

  const selectedCells = config.cellSelection?.selectedCells ?? []

  // Group cells by row
  const rows = selectedCells.map(x => x.getData<GridElement>('row'))
  // Distinct rows
  const distinctRows = rows.filter((v, i, a) => a.indexOf(v) === i)
  // Group cells by row
  const cellsByRow = distinctRows.map(row => selectedCells.filter(x => x.getData<GridElement>('row') === row))

  // Get the text for each cell
  const cellText = cellsByRow.map(row => row.map(cell => cell.getData<string>('data')))
  // Join each row with a tab
  const rowText = cellText.map(row => row.join('\t'))
  // Join all rows with a new lineerfcvb 
  const text = rowText.join('\n')

  // Copy to clipboard
  navigator.clipboard.writeText(text)

  selectedCells.map(x => x.addClasses(['copied']))
  setTimeout(() => {
    selectedCells.map(x => x.removeClasses(['copied']))
  }, 300)
}

function clearSelection<T>(config: GridConfig<T> & GridContext) {
  if (config.cellSelection) {
    const cells = config.cellSelection.selectedCells ?? []
    cells.map(x => x.removeClasses(['selected-top', 'selected-bottom', 'selected-left', 'selected-right', 'selected']))
    config.cellSelection.selectedCells = []
  }
}