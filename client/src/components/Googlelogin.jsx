import { signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { auth, provider } from "../helpers/firebase";
import { showToast } from "../helpers/showToast";
import {useNavigate} from 'react-router-dom'
import { setUser } from "../redux/userSlice";
import axios from 'axios'
import { useDispatch } from "react-redux";

const Googlelogin = () => {

	const navigate = useNavigate()
	const dispatch = useDispatch();


	const handleLogin = async() =>{
		try{
			const googleResponse = await signInWithPopup(auth, provider)
			const user = googleResponse.user

			const bodyData = {
				fullName: user.displayName,
				email: user.email,
				avatar: user.photoURL
			}
			const response = await axios.post('/api/user/google-login', bodyData);
			const data = response.data;
			
			if(!data.success){
				return showToast('error', data.message);
			}
			dispatch(setUser(data.user));	
			
			navigate('/')
			showToast('success', data.message);
			
		}catch(error){
			showToast('error',error.message )
		}
	}

	return (
		<button variant='outline' className='w-full flex items-center gap-2 border p-2 justify-center hover:bg-blue-500 hover:text-white rounded-md'  onClick={handleLogin}>
			<FaGoogle className="text-black hover:text-white "/>
			<p className="font-medium">Continue with Google</p>
		</button>
	)
}

export default Googlelogin
