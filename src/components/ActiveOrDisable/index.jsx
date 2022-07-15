import React from 'react'

function ActiveOrDisable({ isNew, setModal, disableDate, style }) {

  const handleClick = (e) => {
    e.preventDefault();
    setModal(true)
  }

  return (

    !isNew &&
    <button
    style={{...style}}
      className="primary-button"
      onClick={handleClick}>
      {disableDate ? "Riattiva" : "Disabilita"}
    </button>

  )
}

export default ActiveOrDisable
