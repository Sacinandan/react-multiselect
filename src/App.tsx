import React, { FC } from 'react'

import MultiSelectsBox from './containers/multiselects-box'

import './App.scss'
import data from './data'
import CustomButton from './components/custom-button'

const App: FC = () => (
  <div className='app'>
    <header className='header'>
      <h2 className='header__title'>CUSTOM DROPDOWN</h2>
    </header>
    <main>
      <form className='form' onSubmit={ (e) => e.preventDefault() }>
        <MultiSelectsBox data={ data }>

          <CustomButton
            className='form__btn--submit'
            type='submit'
          >
            SUBMIT
          </CustomButton>
        </MultiSelectsBox>
      </form>
    </main>
  </div>
)

export default App
