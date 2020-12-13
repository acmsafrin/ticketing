import {useState} from 'react'
import axios from 'axios'

export default ({url,method,body,onSuccess})=>{
  const [errors,setErrors]=useState(null)

  const doRequest=async (props={})=>{
    try{
      setErrors(null)
      const res=await axios[method](url,{...body,...props})
      if(onSuccess){
        onSuccess(res.data)
      }
      return res.data
    }catch(e){
      console.error(e.message)
      setErrors(
        (<div className="alert alert-danger">
            <h4>Oops...</h4>
            <ul className="my-0">
            {e.response.data.errors.map(e=><li key={e.message}>{e.message}</li>)}
            </ul>
        </div>)
      )
    }  

  }
 
  return {doRequest,errors}
 
}