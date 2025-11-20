import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const Layoute = () => {
  return (
	<div>
	  <Navbar />
	  <Outlet />
	  //footer
	</div>
  )
}

export default Layoute
