import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import axios from "axios";
import { showToast } from "../helpers/showToast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UploadAvatars from "../components/Avatar";
import { useFetch } from "../hooks/userFetch";
import { useEffect, useState } from "react";


export default function Profile() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
      defaultValues: {
        fullName: '',
        email: '',
        username: '',
        password: ''
      },
  })

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");

  const {data:userData, loading, error} = useFetch('/api/user/current-user')

  const userInfo = userData?.data
  
  async function onSubmit(values) {
    try {
      const formData = new FormData();
			formData.append('avatar', selectedFile);
			formData.append('data', JSON.stringify(values))
      

      const response = await axios.patch('/api/user/update-user', formData,{
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data
      if(data.success) {
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

    useEffect(()=> {
      if(userInfo){
        reset({
          fullName: userInfo.fullName || '',
          email: userInfo.email || '',
          username: userInfo.username || '',
        })
      }
    },[userInfo, reset])

    if(loading) return <div>Loading...</div>
      return (
        <div className="flex justify-center items-center w-screen h-auto mt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 bg-gray-200 w-md p-6 rounded-lg shadow-md">
              <Link to='/'>
                <h1 className="text-xl font-bold text-center">My Profile</h1>
              </Link>

              <div className="flex justify-center">
                <UploadAvatars 
                  avatar={userInfo?.avatar} 
                  onChange={(file) => setSelectedFile(file)}
                size={40}/>
              </div>
             
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="border border-gray-400 py-2 px-3 rounded focus:outline-none focus:border-blue-500"
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
                  {...register("password")}
                />
              </div>

              <input
                type="submit"
				        value="Update"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
              />

            </div>
          </form>
        </div>

      )
}