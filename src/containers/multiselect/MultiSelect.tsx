import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import { InputValue, MultiSelectElement, SelectedElement } from '../../models'

import CustomInput from '../../components/custom-input'
import OptionsList from '../../components/options-list'
import CustomButton from '../../components/custom-button'
import OptionPill from '../../components/option-pill'

interface IProps extends MultiSelectElement {
  selectedOptionsList: SelectedElement[]
  inputValue: InputValue[]
  handleChange: (e: ChangeEvent<HTMLInputElement>, selectId: number) => void
  handleToggleOptionsList: (e: MouseEvent<HTMLButtonElement>, selectId: number) => void
  handleSelectOption: (e: MouseEvent<HTMLLIElement>, selectId: number, optionId: number) => void
  handleRemoveSelectedOption: (e: MouseEvent<HTMLSpanElement>, selectId: number, optionId: number) => void
  handleSetActive: (e: MouseEvent<HTMLLIElement>, selectId: number, optionId: number) => void
  handleFocusInput: (e: ChangeEvent<HTMLInputElement>, selectId: number) => void
  handleClearInput: (e: MouseEvent<HTMLButtonElement>, selectId: number) => void
  handlePressKey: (e: KeyboardEvent<HTMLDivElement>, selectId: number, neighbors: number[]) => void
  handleBlur: (e: FocusEvent<HTMLUListElement | HTMLInputElement | HTMLButtonElement>, selectId: number) => void
}

const MultiSelect: FC<IProps> = ({
                                 id,
                                 name,
                                 selectedOptionsList,
                                 options,
                                 hidden,
                                 inputValue,
                                 handleChange,
                                 handleToggleOptionsList,
                                 handleFocusInput,
                                 handleClearInput,
                                 handleSelectOption,
                                 handleSetActive,
                                 handlePressKey,
                                 handleBlur,
                                 handleRemoveSelectedOption
                               }) => {
  console.log('render MultiSelect')
  const filteredOptions = inputValue[id].value.trim()
    ? options.filter(option => RegExp(inputValue[id].value
      .toLowerCase()).test(option.value.toLowerCase()))
    : options

  let activeOptionIdx: number = -2      //  less then -1 for deactivate all options

  const findActiveOptionIdx = (): number => {
    activeOptionIdx = filteredOptions.findIndex((option) => option.isActive)

    if (activeOptionIdx === -1) {       //  findIndex return -1 if all options are inactive
      if (filteredOptions.length) {
        filteredOptions[0].isActive = true
      }
    }

    return activeOptionIdx
  }

  if (filteredOptions.length) {
    findActiveOptionIdx()
  }

  const findActiveOptionAndNeighbours = (): number[] => {
    if (filteredOptions.length && activeOptionIdx !== -2) {
      findActiveOptionIdx()

      const previewId: number = filteredOptions[activeOptionIdx > 0
        ? activeOptionIdx - 1
        : 0].id
      const currentId: number = filteredOptions[activeOptionIdx].id
      const nextId: number = filteredOptions[activeOptionIdx
      <= filteredOptions.length - 2
        ? activeOptionIdx + 1
        : activeOptionIdx].id

      return [ previewId, currentId, nextId ]
    }

    return [ 0, 0, 0 ]
  }

  return (
    <div
      key={ id }
      className='multi-select'
      tabIndex={ 0 }
      onKeyDown={ (e) => handlePressKey(e,
        id,
        findActiveOptionAndNeighbours()) }
    >
      <div className='selected-options-box'>
        { selectedOptionsList.map((select) => select.id === id
          && select.options.map(( option ) =>
          <OptionPill
            key={ option.id }
            selectId={ id }
            optionId={ option.id }
            value={ option.value }
            handleRemoveSelectedOption={ handleRemoveSelectedOption }
          />
        )) }

        <CustomInput
          name={ name }
          handleChange={ handleChange }
          selectId={ id }
          value={ inputValue[id].value }
          onFocus={ (e) => handleFocusInput(e, id) }
          onBlur={ (e) => handleBlur(e, id) }
          fixedLabel={ !!selectedOptionsList[id]?.options.length }
        >

          { hidden ? null :
            <OptionsList
              selectId={ id }
              options={ filteredOptions }
              handleSelectOption={ handleSelectOption }
              handleSetActive={ handleSetActive }
              handleBlur={ handleBlur }
            />
          }
        </CustomInput>
      </div>
      <div className="control-box">
        { selectedOptionsList[id]?.options.length
        || inputValue[id].value.trim() ?
          <CustomButton
            className='btn-remove'
            onClick={ (e) => handleClearInput(e, id) }
          >
            &times;
          </CustomButton>
          : null }

        <CustomButton
          className='btn-toggle'
          onClick={ (e) => handleToggleOptionsList(e, id) }
          onBlur={ (e) => handleBlur(e, id)}
        >
          &#9207;
        </CustomButton>
      </div>
    </div>
  )
}
export default MultiSelect
