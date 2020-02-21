import React, { ChangeEvent, FC, InputHTMLAttributes,  ReactNode } from 'react'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode
  selectId: number
  name: string
  value: string
  fixedLabel: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement>, selectId: number) => void
}

const CustomInput: FC<IProps> = ({
                                   children,
                                   selectId,
                                   handleChange,
                                   name,
                                   value,
                                   fixedLabel,
                                   ...ownProps
                                 }) => (
  <div className='group'>
    <input
      className='form-input'
      type='text'
      name={ name }
      onChange={(e) => handleChange(e, selectId) }
      value={ value }
      { ...ownProps }
    />

    { name &&
    <label
      className={ `${ value.length || fixedLabel ? 'shrink' : '' } form-input-label` }
    >
      { name }
    </label>
    }

    { children }
  </div>
)

export default CustomInput
