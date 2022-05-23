import React, { useEffect, useState } from "react";
import useService from '../hooks/useService';

import Table from "../components/Table/Table"

const Community = () => {
  const [state, setState] = useState({
    values: []
  })
  const [result, call] = useService("/team/users");

  useEffect(() => {
    call()
  }, []);

  useEffect(() => {
    let newResult = []
    if (result.response) {
      let obj = result.response.team.map((item) => {
        if (item.picImage && item.picImageThumbnail) {
          return (
            {
              firstName: item.firstName,
              lastName: item.lastName,
              img: true
            }
          )
        }
        return (
          {
            firstName: item.firstName,
            lastName: item.lastName,
            img: false
          }
        )
      })
      newResult.push(obj)
    }

    setState({
      ...state,
      values: newResult[0]
    })
  }, [result])


  return (
    <div>
      <button>
        Aggiungi
      </button>
      <Table
        headers={['Nome', 'Cognome', 'Immagine caricata', 'Modifica']}
        values={state.values}
        buttonEdit={true}
      />
    </div>
  )
}

export default Community