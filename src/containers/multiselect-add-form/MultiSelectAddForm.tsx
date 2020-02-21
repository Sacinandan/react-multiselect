import React, { ChangeEvent, FC, KeyboardEvent, MouseEvent, useState } from 'react'
import { InitialValuesState, InputStatus, MultiSelectElement } from '../../models'
import {
  Button, initializeOptions,
  initializeSelectState,
  initializeValuesState,
  normalizeText
} from '../../utils'

import CustomButton from '../../components/custom-button'
import CustomInput from '../../components/custom-input'
import OptionPill from '../../components/option-pill'

interface IProps {
  newSelectId: number
  hideAddForm: boolean
  addNewMultiSelect: (newSelect: MultiSelectElement) => void
}

const MultiSelectAddForm: FC<IProps> = ({
                                          newSelectId,
                                          hideAddForm,
                                          addNewMultiSelect
                                        }) => {
  const [ newSelect, setNewSelect ] = useState<MultiSelectElement>(initializeSelectState())
  const [ inputValues, setInputValues ] = useState<InitialValuesState>(initializeValuesState())
  const [ optionId, setOptionId ] = useState<number>(0)
  const [ inputStatus, setInputStatus ] = useState<InputStatus>({
    wasAttempt: false,
    isFocused: false
  })

  const removeLastOption = (): void => {
    const currentSelect: MultiSelectElement = { ...newSelect }
    currentSelect.options.pop()
    setNewSelect(currentSelect)
  }

  const addNewOption = (value: string): void => {
    setNewSelect(prevState => ({
      ...prevState,
      options: [
        ...prevState.options,
        {
          id: optionId,
          value,
          isActive: false
        }
      ]
    }))

    setOptionId(optionId + 1)
  }

  const checkValues = (name: string, value: string): void => {

    if (name === 'Options') {
      const newOptionName: string[] = value.split(', ')

      if (newOptionName.length > 1) {
        if (newOptionName[0].trim()) addNewOption(newOptionName[0])

        setInputValues(({ name }) => ({
          name,
          option: ''
        }))
      }
    } else {
      setNewSelect(prevState => ({
        ...prevState,
        name: value
      }))
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, selectId: number): void => {
    const { value, name } = e.target
    const normalizedValue = normalizeText(value)

    setInputValues(prevState => ({
      ...prevState,
      [name === newSelect.name || name === 'Name' ? 'name' : 'option']: normalizedValue
    }))

    checkValues(name, normalizedValue)
  }

  const handleClearInput = (e: MouseEvent<HTMLButtonElement>, name: string): void => {
    e.preventDefault()

    setInputValues(prevState => ({
      ...prevState,
      [name === newSelect.name || name === 'Name' ? 'name' : 'option']: ''
    }))

    if (name === 'option') {
      setNewSelect(prevState => ({
        ...prevState,
        options: []
      }))
    } else {
      setNewSelect(prevState => ({
        ...prevState,
        name: ''
      }))
    }
  }

  const handlePressKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === Button.Backspace && !inputValues.option.trim()) {
      removeLastOption()
    }
  }

  const handleRemoveSelectedOption = (e: MouseEvent<HTMLSpanElement>,
                                      selectId: number,
                                      optionId: number): void => {
    setNewSelect({
      ...newSelect,
      options: newSelect.options.filter(({ id }) => id !== optionId)
    })
  }

  const handleAddNewMultiSelect = (e: MouseEvent<HTMLButtonElement>,
                                   newSelect: MultiSelectElement): void => {
    e.preventDefault()

    if (newSelect.name.trim() && newSelect.options.length) {
      addNewMultiSelect({
        ...newSelect,
        id: newSelectId,
        options: initializeOptions(newSelect.options.map(({ value }) => value))
      })

      setInputValues(initializeValuesState())
      setNewSelect(initializeSelectState())
    }

    setInputStatus({ wasAttempt: true, isFocused: false })
  }

  return (
    hideAddForm ? null :
      <div className='modal-box'>
        <div className='multi-select-add-form'>
          <h2 className='header__title'>NEW SELECT</h2>
          <div
            className='multi-select'
          >
            <div className='selected-options-box'>
              <CustomInput
                selectId={ newSelectId }
                name={ newSelect.name.trim() ? newSelect.name : 'Name' }
                handleChange={ handleChange }
                value={ inputValues.name }
                fixedLabel={ !!inputValues.name.trim() }
                children={ null }
              />
            </div>

            <div className="control-box">
              { inputValues.name.trim() ?
                <CustomButton
                  className='btn-remove'
                  onClick={ (e) => handleClearInput(e, inputValues.name) }
                >
                  &times;
                </CustomButton>
                : null }
            </div>

            <div className="status-box">
              { inputStatus.wasAttempt
                ? newSelect.name.trim() || inputValues.name.trim()
                  ? <strong className='success'>&#10003;</strong>
                  : <strong className='attention'>&times;</strong>
                : null }
            </div>
          </div>

          <div className='multi-select'>
            <div className='selected-options-box'>
              { newSelect.options.map(({ id, value }) =>
                <OptionPill
                  key={ id }
                  selectId={ 0 }
                  optionId={ id }
                  value={ value }
                  handleRemoveSelectedOption={ handleRemoveSelectedOption }
                />
              ) }

              <CustomInput
                selectId={ newSelectId }
                name='Options'
                handleChange={ handleChange }
                value={ inputValues.option }
                fixedLabel={ !!inputValues.option.trim() || !!newSelect.options.length }
                children={ null }
                onKeyDown={ (e) => handlePressKey(e) }
                onFocus={ () => setInputStatus(prevState => ({ ...prevState, isFocused: true })) }
                onBlur={ () => setInputStatus(prevState => ({ ...prevState, isFocused: false })) }
              />
            </div>

            <div className="control-box">
              { newSelect.options.length || inputValues.option.trim() ?
                <CustomButton
                  className='btn-remove'
                  onClick={ (e) => handleClearInput(e, 'option') }
                >
                  &times;
                </CustomButton>
                : null }
            </div>

            <div className="status-box">
              { inputStatus.wasAttempt
                ? newSelect.options.length
                  ? <strong className='success'>&#10003;</strong>
                  : <strong className='attention'>&times;</strong>
                : null }
            </div>
          </div>

          { inputStatus.isFocused &&
          <em className='tooltip'>
            Separate options with a comma and space
          </em>
          }

          <CustomButton
            className='form__btn--submit'
            onClick={ (e) => handleAddNewMultiSelect(e, newSelect) }
          >
            ADD
          </CustomButton>
        </div>
      </div>
  )
}

export default MultiSelectAddForm
