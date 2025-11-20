import { useSelector } from 'react-redux'
import {Link } from 'react-router-dom'
import Dropdown from './Dropdown'

const Navbar = () => {

	const user = useSelector(state => state.user)
	
	
	return (
		<div className="flex items-center justify-between bg-blue-500 px-6 py-3 w-full shadow-md">
			<h1 className="text-white text-xl font-bold">Faiyaz</h1>

			<div className="flex items-center">
				{user && user.isLoggedIn === true ?
					
					<Dropdown user = {{user}}/>
				:
					<Link
					to="/sign-up"
					className="text-white hover:bg-blue-600 px-4 py-2 rounded transition"
					>
					Sign Up
					</Link>

				}

			</div>


		</div>

	)
}

export default Navbar
