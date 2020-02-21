import React, { FC, FocusEvent, MouseEvent } from 'react'
import { Option } from '../../models'

interface IProps {
  selectId: number
  options: Option[]
  handleSelectOption: (e: MouseEvent<HTMLLIElement>, id: number, optionId: number) => void
  handleSetActive: (e: MouseEvent<HTMLLIElement>, id: number, optionId: number) => void
  handleBlur: (e: FocusEvent<HTMLUListElement | HTMLInputElement | HTMLButtonElement>, selectId: number) => void
}

const OptionsList: FC<IProps> = ({
                                   selectId,
                                   options,
                                   handleSelectOption,
                                   handleSetActive,
                                   handleBlur
                                 }) => (
  <ul
    className='options-list'
    onBlur={ (e) => handleBlur(e, selectId) }
  >
    { options.length
      ? options.map(({ id, value, isActive }) => (
        <li className={ `option${ isActive ? ' active' : '' }` }
            key={ id }
            value={ value }
            onClick={ (e) => handleSelectOption(e, selectId, id) }
            onMouseEnter={ (e) => handleSetActive(e, selectId, id) }
        >
          { value }
        </li>)
      )
      : <p className='message'>All options have been selected</p> }
  </ul>
)

export default OptionsList
