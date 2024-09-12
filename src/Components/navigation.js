import React from 'react'
import '../CSS/navigation.css'

/**
 * Navigation component for PDF viewer.
 *
 * @param {object} props The component props.
 * @param {number} props.numPages The number of pages.
 * @param {number} props.pageNumber The current page number.
 * @param {number} props.scale The current scale.
 * @param {string} props.inputValue The input value.
 * @param {Function} props.setInputValue The setInputValue function.
 * @param {Function} props.previousPage The previousPage function.
 * @param {Function} props.nextPage The nextPage function.
 * @param {Function} props.resetScale The resetScale function.
 * @param {Function} props.decreaseScale The decreaseScale function.
 * @param {Function} props.increaseScale The increaseScale function.
 * @param {Function} props.handleInputChange The handleInputChange function.
 * @param {Function} props.handleKeyPress The handleKeyPress function.
 * @param {Function} props.setScale The setScale function.
 * @returns {React.JSX.Element} The Navigation component.
 */
const Navigation = ({
  numPages,
  pageNumber,
  scale,
  inputValue,
  setInputValue,
  previousPage,
  nextPage,
  resetScale,
  decreaseScale,
  increaseScale,
  handleInputChange,
  handleKeyPress,
  setScale
}) => {
  return (
    <div className='navigation-box'>
      <div className='navigation'>
        <div className='page-number'>
          <input
            type='text'
            value={inputValue}
            onClick={(event) => { event.target.select() }}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <span> / {numPages || '-'}</span>
        </div>
        <button
          type='button'
          className='previous'
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          &lt;
        </button>{' '}
        <button
          type='button'
          className='next'
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          &gt;
        </button>
        <button type='button' className='reset' onClick={resetScale}>
          {Math.round((scale * 100) / 1.5)}%
        </button>
        <button
          type='button'
          className='minus'
          disabled={scale <= 0.5}
          onClick={decreaseScale}
        >
          -
        </button>{' '}
        <input
          type='range'
          min='0.5'
          max='5'
          value={scale}
          onChange={(event) => setScale(Number(event.target.value))}
          step='0.2'
        />{' '}
        <button
          type='button'
          className='plus'
          disabled={scale >= 5}
          onClick={increaseScale}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default Navigation
