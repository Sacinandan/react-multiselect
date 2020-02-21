import React, { FC, MouseEvent } from 'react'

interface IProps {
  selectId: number
  optionId: number
  value: string
  handleRemoveSelectedOption: (e: MouseEvent<HTMLSpanElement>, selectId: number, optionId: number) => void
}

const OptionPill: FC<IProps> = ({
                                  selectId,
                                  optionId,
                                  value,
                                  handleRemoveSelectedOption
                                }) => (
  <div className='selected-option'>
    { value }
    <span
      className='selected-option__btn-remove'
      onClick={ (e) => handleRemoveSelectedOption(e, selectId, optionId) }
    >
              &times;
            </span>
  </div>
)

export default OptionPill
