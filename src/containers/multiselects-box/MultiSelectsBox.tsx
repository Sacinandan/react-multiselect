import React, {
  ChangeEvent,
  FC,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useState
} from 'react'
import {
  InputValue,
  MultiSelectElement,
  SelectedElement,
  Option,
  SelectData
} from '../../models'
import {
  Button,
  initializeInputValues,
  initializeSelectedList,
  initializeMultiSelects,
  filterArrays
} from '../../utils'

import MultiSelectAddForm from '../multiselect-add-form'
import CustomButton from '../../components/custom-button'
import MultiSelect from '../multiselect'

interface IProps {
  children: ReactNode
  data: SelectData[]
}

const MultiSelectsBox: FC<IProps> = ({ children, data }) => {
  const [ multiSelectsList, setMultiSelectsList ] = useState<MultiSelectElement[]>(initializeMultiSelects(data))
  const [ selectedOptionsList, setSelectedOptionsList ] = useState<SelectedElement[]>(initializeSelectedList(multiSelectsList))
  const [ inputValue, setInputValue ] = useState<InputValue[]>(initializeInputValues(multiSelectsList))
  const [ hideAddForm, setHideAddForm ] = useState<boolean>(true)

  const toggleOptionsList = (selectId: number, isHidden: boolean = true): void => {
    const currentSelect: MultiSelectElement[] = [ ...multiSelectsList ]
    currentSelect[selectId].hidden = isHidden
    setMultiSelectsList(multiSelectsList.map((select) => ({
      ...select,
      hidden: select.id === selectId ? isHidden : true
    })))
  }

  const clearInputValues = (): void => {
    const currentValuesList: InputValue[] = inputValue.map(({ id }) => ({
      id,
      value: ''
    }))
    setInputValue(currentValuesList)
  }

  const activateOption = (selectId: number, optionId: number): void => {
    const currentSelectsList: MultiSelectElement[] = [ ...multiSelectsList ]
    currentSelectsList[selectId].options
      .map((option) => option.isActive = option.id === optionId)
    setMultiSelectsList(currentSelectsList)
  }

  const addOptionToSelected = (selectId: number, optionId: number): void => {
    setSelectedOptionsList(selectedOptionsList
      .map((select) => (select.id === selectId
          ? {
            id: selectId,
            options: [
              ...select.options,
              multiSelectsList[selectId].options[optionId]
            ]
          }
          : select
      ))
    )

    clearInputValues()
  }

  const moveOnTheOptionsList = (selectId: number,
                                neighbors: number[],
                                keyCode: number): void => {
    const [ previewOption, currentOption, nextOption ]: number[] = neighbors
    const currentSelectsList: MultiSelectElement[] = [ ...multiSelectsList ]

    if (keyCode === Button.Up && previewOption !== currentOption) {
      currentSelectsList[selectId].options[previewOption].isActive = true
      currentSelectsList[selectId].options[currentOption].isActive = false
    }

    if (keyCode === Button.Down && nextOption !== currentOption) {
      currentSelectsList[selectId].options[nextOption].isActive = true
      currentSelectsList[selectId].options[currentOption].isActive = false
    }

    setMultiSelectsList(currentSelectsList)
  }

  const removeLastSelectedOption = (selectId: number): void => {
    const currentSelectedOptionsList: SelectedElement[] = [ ...selectedOptionsList ]
    currentSelectedOptionsList[selectId].options.pop()
    setSelectedOptionsList(currentSelectedOptionsList)
  }

  const addNewMultiSelect = (newSelect: MultiSelectElement): void => {
    setInputValue([ ...inputValue, { id: newSelect.id, value: '' } ])
    setSelectedOptionsList([ ...selectedOptionsList, { id: newSelect.id, options: [] } ])
    setMultiSelectsList([ ...multiSelectsList, newSelect ])
    setHideAddForm(true)
  }

  const handleFocusInput = (e: ChangeEvent<HTMLInputElement>,
                            selectId: number): void => {
    toggleOptionsList(selectId, false)
  }

  const handleBlur = (e: FocusEvent<HTMLUListElement
    | HTMLInputElement
    | HTMLButtonElement>, selectId: number): void => {
    if (e.relatedTarget === null
    ) toggleOptionsList(selectId)
  }

  const handleToggleOptionsList = (e: MouseEvent<HTMLButtonElement>,
                                   optionId: number): void => {
    e.preventDefault()
    setMultiSelectsList(multiSelectsList.map(({
                                                id,
                                                hidden,
                                                ...values
                                              }) => ({
      id,
      hidden: id === optionId ? !hidden : true,
      ...values
    })))
  }

  const handlePressKey = (e: KeyboardEvent<HTMLDivElement>,
                          selectId: number,
                          neighbors: number[]): void => {
    switch (e.keyCode) {
      case Button.Enter:
        e.preventDefault()

        if (selectedOptionsList[selectId].options.length
          < multiSelectsList[selectId].options.length) {
          addOptionToSelected(selectId, neighbors[1])
        }
        break

      case Button.Esc:
        multiSelectsList.map(({ id }) => toggleOptionsList(id))
        break

      case Button.Up:
        moveOnTheOptionsList(selectId, neighbors, e.keyCode)
        break

      case Button.Down:
        moveOnTheOptionsList(selectId, neighbors, e.keyCode)
        break

      case Button.Backspace:
        removeLastSelectedOption(selectId)
        break
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>,
                        selectId: number = multiSelectsList.length): void => {
    e.preventDefault()
    setInputValue(inputValue.map(({ id, value }) => ({
      id,
      value: id === selectId
        ? e.target.value
        : value
    })))
  }

  const handleClearInput = (e: MouseEvent<HTMLButtonElement>, selectId: number): void => {
    e.preventDefault()
    clearInputValues()

    if (selectedOptionsList.length) {
      const currentSelectedOptionsList: SelectedElement[] = [ ...selectedOptionsList ]
      currentSelectedOptionsList[selectId].options = []

      const currentSelectsList: MultiSelectElement[] = [ ...multiSelectsList ]
      currentSelectsList[selectId].options.map((option) => option.isActive = false)

      setSelectedOptionsList(currentSelectedOptionsList)
      setMultiSelectsList(currentSelectsList)
    }
  }

  const handleSetActive = (e: MouseEvent<HTMLLIElement>,
                           selectId: number,
                           optionId: number): void => {
    activateOption(selectId, optionId)
  }

  const handleSelectOption = (e: MouseEvent<HTMLLIElement>,
                              selectId: number,
                              optionId: number): void => {
    addOptionToSelected(selectId, optionId)
  }

  const handleRemoveSelectedOption = (e: MouseEvent<HTMLSpanElement>,
                                      selectId: number,
                                      optionId: number): void => {
    const currentSelectedOptionsList: SelectedElement[] = [ ...selectedOptionsList ]
    currentSelectedOptionsList[selectId].options
      .splice(currentSelectedOptionsList[selectId].options
        .findIndex(({ id }) => id === optionId), 1)
    setSelectedOptionsList(selectedOptionsList)
  }

  const handleToggleAddForm = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setHideAddForm(!hideAddForm)
  }

  return (
    <>
      { multiSelectsList.map(({
                                id,
                                name,
                                options,
                                hidden
                              }) => {
        const filteredOptions: Option[] = id < selectedOptionsList.length
          ? filterArrays(options, selectedOptionsList[id].options)
          : options
        return (
          <MultiSelect
            key={ id }
            id={ id }
            name={ name }
            selectedOptionsList={ selectedOptionsList }
            options={ filteredOptions }
            hidden={ hidden }
            handleChange={ handleChange }
            inputValue={ inputValue }
            handleToggleOptionsList={ handleToggleOptionsList }
            handleFocusInput={ handleFocusInput }
            handlePressKey={ handlePressKey }
            handleClearInput={ handleClearInput }
            handleSelectOption={ handleSelectOption }
            handleSetActive={ handleSetActive }
            handleRemoveSelectedOption={ handleRemoveSelectedOption }
            handleBlur={ handleBlur }
          />
        )
      }) }

      { children }

      <CustomButton
        className='btn-add-select'
        onClick={ handleToggleAddForm }
      >
        { hideAddForm ? 'NEW SELECT' : 'CLOSE' }
      </CustomButton>

      <MultiSelectAddForm
        newSelectId={ multiSelectsList.length }
        hideAddForm={ hideAddForm }
        addNewMultiSelect={ addNewMultiSelect }
      />
    </>
  )
}

export default MultiSelectsBox
