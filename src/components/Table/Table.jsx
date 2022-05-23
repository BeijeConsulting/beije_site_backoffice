import React from "react";
import table_style from './Table.module.css'

const headers = [
  'titolo 1',
  'titolo 2',
  'titolo 3',
  'titolo 4',
  'Modifica'
]

const values = [
  {
    id: 1,
    name: 'Paperino',
    surname: 'Pap',
    foto: true
  },
  {
    id: 2,
    name: 'Topolino',
    surname: 'Top',
    foto: true
  },
  {
    id: 3,
    name: 'Minnie',
    surname: 'Min',
    foto: true
  },
  {
    id: 4,
    name: 'Pluto',
    surname: 'Plu',
    foto: true
  },
  {
    id: 5,
    name: 'Pippo',
    surname: 'Pip',
    foto: false
  }
]

const Table = (props) => {

  const handleOnClick = () => {
    props.eventOnClick
  }

  return (
    <table
      className={table_style.table}
    >
      <tbody>
        <tr>
          {props.headers.map((item, key) => {
            return (
              <th
                key={key}
              >
                {item}
              </th>
            )
          })}
        </tr>
        {
          props.values.map((item, key) => {
            return (
              <tr
                key={key}
              >
                {
                  Object.keys(item).map((index) => {
                    return (
                      <td
                        key={index}
                      >
                        {typeof (item[index]) === 'boolean' && item[index] === true &&
                          '✔'
                        }
                        {typeof (item[index]) === 'boolean' && item[index] === false &&
                          '❌'
                        }
                        {typeof (item[index]) !== 'boolean' &&
                          item[index]
                        }
                      </td>
                    )
                  })
                }
                {
                  props.buttonEdit &&
                  <td>
                    <button
                      onClick={handleOnClick}
                    >
                      Edit
                    </button>
                  </td>
                }
              </tr>
            )
          })
        }
      </tbody>
    </table >
  )
}

Table.defaultProps = {
  headers: headers,
  values: values,
  buttonEdit: false
}

export default Table