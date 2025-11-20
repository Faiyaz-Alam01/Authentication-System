import { useState } from 'react'
import './App.css'
import Index from './pages/Index'
import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Layoute from './Layout/Layoute'
import ChangePassword from './pages/ChangePassword'
import Profile from './pages/Profile'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layoute />}>
          <Route path='/change-password' element={<ChangePassword />}/>
          <Route path='/profile' element={<Profile />}/>
        </Route>

        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp />}/>

      </Routes>
    </>
  )
}

export default App
