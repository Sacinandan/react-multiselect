import { SelectData, InputValue, MultiSelectElement, Option, SelectedElement, InitialValuesState } from '../models'

/**
 *
 * @param {SelectData[]}  data  array of multi-selects data
 * @return MultiSelectElement[] array of multi-selects
 * @description Initial MultiSelectsBox data
 */
export const initializeMultiSelects = (data: SelectData[]): MultiSelectElement[] => {
  let selectId: number = 0

  return data.map(select => ({
    id: selectId++,
    name: select.name,
    options: initializeOptions(select.options),
    hidden: true
  }))
}

/**
 *
 * @param {string[]}  options array of options for multi-select
 * @return Option[] array of options
 * @description Initial MultiSelectsBox options data
 */
export const initializeOptions = (options: string[]): Option[] => {
  let optionId: number = 0

  return options.map(option => ({
    id: optionId++,
    value: option,
    isActive: false
  }))
}

/**
 *
 * @param {MultiSelectElement[]}  initialState array of options for multi-select
 * @return SelectedElement[] array of objects (selected options with id of multi-select)
 * @description Initial MultiSelectsBox options data
 */
export const initializeSelectedList = (initialState: MultiSelectElement[]): SelectedElement[] => initialState
  .map(({ id }) => ({ id, options: [] }))

/**
 *
 * @param {MultiSelectElement[]}  initialState array of multi-selects
 * @return : InputValue[] array of input values
 * @description Initial Inputs for MultiSelectsBox
 */
export const initializeInputValues = (initialState: MultiSelectElement[]): InputValue[] => initialState
  .map(({ id }) => ({ id, value: '' }))

/**
 *
 * @return {MultiSelectElement} clear new multi-select
 * @description Initial state for new multi-select
 */
export const initializeSelectState = (): MultiSelectElement => ({
  id: 0,
  name: '',
  options: [],
  hidden: true
})
/**
 *
 * @return {InitialValuesState} clear new multi-select
 * @description Initial inputs for create new multi-select
 */
export const initializeValuesState = (): InitialValuesState => ({
  name: '',
  option: ''
})

/**
 *
 * @param {Option[]} arr1 array of all options
 * @param {Option[]} arr2 array of selected options
 * @return {Option[]} array of options
 * @description filter and remove selected options
 */
export const filterArrays = (arr1: Option[], arr2: Option[]): Option[] => arr1.filter((arr1El) => !arr2.filter(arr2El => arr2El.id === arr1El.id).length)

/**
 *
 * @param {string} value of text for fix
 * @return {string} string of text
 * @description rewrite text for capitalize first letters and remove spaces
 */
export const normalizeText = (value: string): string => {
  return value.split(' ')
    .map(word => word.substring(0, 1).toUpperCase() + word.substring(1)).join(' ')
    .replace(/ +(?= )/g,'')
}
/**
 *
 * @description Enum for keyboard codes
 * @readonly
 * @enum {number}
 * @type {number}
 */
export enum Button {
  Backspace = 8,
  Enter = 13,
  Esc = 27,
  Up = 38,
  Down = 40
}
