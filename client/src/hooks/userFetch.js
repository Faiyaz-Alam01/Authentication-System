import { useEffect, useState } from "react"

export const useFetch =  (url, options={}, dependencies = []) => {

	const [data, setData] = useState();
	const [loading, setloading] = useState(false)
	const[error, setError] = useState()

	
	useEffect(()=>{
		const fetData = async () => {
			setloading(true)
			
			try {
				const response = await fetch(url, options)
				const responseData = await response.json()
				// console.log("response Data",responseData);
				
				if(!response.ok){
					throw new Error(`Error: ${response.statusText}, ${response.status}`)
				}
				setData(responseData)
				setError()

			} catch (error) {
				setError(error)
			}finally{
				setloading(false)
			}

		}
		fetData()
	},dependencies)	
	
	return {data, loading, error}
}


