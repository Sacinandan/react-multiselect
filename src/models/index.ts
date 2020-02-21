export interface SelectData {
  name: string
  options: string[]
}

export interface MultiSelectElement {
  id: number
  name: string
  options: Option[]
  hidden: boolean
}

export interface SelectedElement {
  id: number
  options: Option[]
}

export interface Option {
  id: number
  value: string
  isActive: boolean
}

export interface InputValue {
  id: number
  value: string
}

export interface InitialValuesState {
  name: string
  option: string
}

export interface InputStatus {
  wasAttempt: boolean
  isFocused: boolean
}
