import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import axios from "axios";
import { showToast } from "../helpers/showToast";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate();

  async function onSubmit(values) {
    try {
      const response = await axios.post('/api/user/register', values);
      const data = response.data
      if(data.success) {
        showToast('success',data.message)
        navigate('/sign-in')
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
            <div className="flex flex-col gap-4 bg-gray-200 w-96 p-6 rounded-lg shadow-md">
              <Link to='/'>
                <h1 className="text-xl font-bold text-center">SignUp</h1>
              </Link>
             
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter fullname"
                  {...register("fullName", { required: true, minLength: 3 })}
                />
                {errors.fullname && (
                  <span className="text-red-500 text-sm">
                    Fullname is required (min 3 characters)
                  </span>
                )}
              </div>

             
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

              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter username"
                  {...register("username", { required: true, minLength: 3 })}
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    Username is required (min 3 characters)
                  </span>
                )}
              </div>

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

              <input
                type="submit"
                value="Register"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
              />

              <div className="w-full border-t border-gray-600 mt-2"></div>

              <div className="text-center flex items-center justify-center">
                <p className="">Already have an account?  </p>
                  <Link to="/sign-in" className="text-blue-500 hover:text-blue-700 font-medium pl-1 ">
                      Login
                  </Link>
              </div>
            </div>
          </form>
        </div>

      )
}