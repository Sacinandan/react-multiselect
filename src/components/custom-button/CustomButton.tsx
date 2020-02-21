import React, { ButtonHTMLAttributes, FC, MouseEvent, ReactNode } from 'react'

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const CustomButton: FC<IProps> = ({children,...ownProps}) => (
  <button {...ownProps}>
    {children}
  </button>
)

export default CustomButton
