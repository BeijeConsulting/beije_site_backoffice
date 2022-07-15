import React from 'react'

function ActiveOrDisable({ isNew, setModal, disableDate }) {

  const handleClick = (e) => {
    e.preventDefault();
    setModal(true)
  }

  return (

    !isNew &&
    <button
    style={{width: "50%"}}
      className="primary-button"
      onClick={handleClick}>
      {disableDate ? "Riattiva" : "Disabilita"}
    </button>

  )
}

export default ActiveOrDisable
