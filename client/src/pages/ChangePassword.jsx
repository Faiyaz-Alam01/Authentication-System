import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../helpers/showToast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { removeUser } from "../redux/userSlice";


export default function signIn() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    async function onSubmit(values) {      
      try {
        const response = await axios.post('/api/user/change-password', values);
        const data = response.data
      
        if(data.success) {
          dispatch(removeUser())
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
    <div className="flex justify-center items-center w-screen mt-30 h-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 bg-gray-300 w-md p-6 rounded-lg shadow-md">
            <Link to='/'>
              <IoMdArrowRoundBack className="size-5" />
              <h1 className="text-xl font-bold text-center">Change Password</h1>

            </Link>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">Old Password</label>
              <input
                type="password"
                className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter Old Password"
                {...register("oldPassword", { required: true, minLength: 3})}
              />
              {errors.oldPassword && (
                <span className="text-red-500 text-sm">
                  Old Password is required (min 3 characters)
                </span>
              )}
            </div>
            {/* Password */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter password"
                {...register("newPassword", { required: true, minLength: 3 })}
              />
              {errors.newPassword && (
                <span className="text-red-500 text-sm">
                New Password is required (min 3 characters)
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter password"
                {...register("confirmPassword", { required: true, minLength: 3 })}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                Confirm Password is required (min 3 characters)
                </span>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
            >Confirm</button>

          </div>
        </form>  
    </div>

    )
}