import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../helpers/showToast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import Googlelogin from "../components/Googlelogin";


export default function signIn() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

    const navigate = useNavigate();
    const dispatch = useDispatch()
    
    async function onSubmit(values) {
      try {
        const response = await axios.post('/api/user/login', values);
        const data = response.data
      
        if(data.success) {
          dispatch(setUser(data.user))
          showToast('success',data.message)
          navigate('/')
          return;
        }
        showToast('error', data.message)
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        showToast('error', message);
      }
      
    }
    return (
       <div className="flex justify-center items-center w-screen h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 bg-gray-200 w-80 p-6 rounded-lg shadow-md">
          <Link to='/'>
            <h1 className="text-xl font-bold text-center">SignIn</h1>
          </Link>
          <div>
            <Googlelogin />
          </div>

          <div className="my-4">
            <hr className="border w-full"/>
          </div>



          {/* Email */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter email"
              {...register("email", { required: true, minLength: 10, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                Email is required (min 10 characters)
              </span>
            )}
          </div>
          {/* Password */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
              {...register("password", { required: true, minLength: 3 })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                Password is required (min 3 characters)
              </span>
            )}
          </div>

          <div className="flex justify-center items-center">
            <span> </span>
            <Link to="/sign-up" className="text-blue-500 hover:text-blue-700 pl-1 font-medium">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >Login</button>
          
          <div className="flex justify-center items-center">
            <span>Dont'have an account? </span>
            <Link to="/sign-up" className="text-blue-500 hover:text-blue-700 pl-1 font-medium">
              SignIn
            </Link>
          </div>

        </div>
      </form>
      
    </div>

    )
}