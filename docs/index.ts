import {
  createGrid,
  useColumns,
  useData,
  useLogger,
} from '../packages/core/src'

// function renderGrid() {
const grid = createGrid(
  useData([
    { name: 'John', age: 20 },
    { name: 'Jane', age: 21 },
  ]),
  useLogger(),
  useColumns([
    { key: 'name', label: 'Name', width: 100 },
    { key: 'age', label: 'Age', width: 100 },
  ])
)

grid({
  container: document.getElementById('grid'),
})
// }

// const button = document.createElement('button')
// button.innerText = 'Render Grid'
// button.onclick = renderGrid
// button.style.marginBottom = '10px'
// document.body.prepend(button)
