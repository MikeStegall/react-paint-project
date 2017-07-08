import React, { Component } from 'react'
import mori from 'mori'

// -----------------------------------------------------------------------------
// Mori Component
// -----------------------------------------------------------------------------

// a MoriComponent receives a JavaScript Object with one key: imdata
// imdata should be a mori structure that supports mori.equals() comparisons
class MoriComponent extends Component {
  // only update the component if the mori data structure is not equal
  shouldComponentUpdate (nextProps, _nextState) {
    return !mori.equals(this.props.imdata, nextProps.imdata)
  }
}

// -----------------------------------------------------------------------------
// Pallet
// -----------------------------------------------------------------------------

function colorPallet () {
  const colors = ['black', 'red', 'yellow', 'purple', 'blue', 'green', 'cyan', 'magenta', 'orange', 'grey']
  let palletColors = colors.map(function (colors, index) {
    return <div className={colors} key={index} />
  })
  return (
    <div className='color-pallet'>
      <h4>Pick a Color!</h4>
      {palletColors}
    </div>
  )
}
// -----------------------------------------------------------------------------
// Pixel
// -----------------------------------------------------------------------------
function clickPixel (rowIdx, colIdx) {
  const currentState = window.CURRENT_STATE
  const newState = mori.updateIn(currentState, ['board', rowIdx, colIdx])
  window.NEXT_STATE = newState
}

class Pixel extends MoriComponent {
  render () {
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')
    const colIdx = mori.get(this.props.imdata, 'colIdx')

    let className = 'pixel'

    const clickFn = mori.partial(clickPixel, rowIdx, colIdx)
    const key = 'pixel-' + rowIdx + '-' + colIdx

    return (
      <div key={key} className={className} onClick={clickFn} />
    )
  }
}

// -----------------------------------------------------------------------------
// Board
// -----------------------------------------------------------------------------

class Row extends MoriComponent {
  render () {
    const rowVec = mori.get(this.props.imdata, 'rows')
    const numCols = mori.count(rowVec)
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')

    let pixels = []
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      let isOn = mori.get(rowVec, colIdx)
      let pixelData = mori.hashMap('rowIdx', rowIdx, 'colIdx', colIdx, 'isOn', isOn)
      let key = 'pixel-' + rowIdx + '-' + colIdx

      pixels.push(<Pixel imdata={pixelData} key={key} />)
    }

    return (
      <div className='row'>{pixels}</div>
    )
  }
}

function clickResetBtn () {
  window.NEXT_STATE = mori.hashMap('board', window.EMPTY_BOARD)
}

// attempt to set an invalid state
// this should be caught by the isValidState function in the render loop
// function clickSetInvalidStateBtn () {
//   window.NEXT_STATE = 'foo'
// }

// function clickInvertBoardBtn () {
//   const currentBoard = mori.get(window.CURRENT_STATE, 'board')
//   const emptyVector = mori.vector()
//   const newBoardList = mori.map(function (row) {
//     const invertedRowList = mori.map(booleanNot, row)
//     return mori.into(emptyVector, invertedRowList)
//   }, currentBoard)
//   const newBoardVector = mori.into(emptyVector, newBoardList)
//
//   window.NEXT_STATE = mori.assoc(window.CURRENT_STATE, 'board', newBoardVector)
// }

function App (props) {
  const board = mori.get(props.imdata, 'board')
  const numRows = mori.count(board)

  let rows = []
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let rowVec = mori.get(board, rowIdx)
    let rowData = mori.hashMap('rows', rowVec, 'rowIdx', rowIdx)
    let key = 'row-' + rowIdx

    rows.push(<Row imdata={rowData} key={key} />)
  }

  return (
    <div className='app-container'>
      <h1>Paint</h1>
      <div className='canvus'>
        <div className='board'>{rows}</div>
        {colorPallet()}
      </div>
      <button onClick={clickResetBtn}>Undo</button>
    </div>
  )
}

export default App
