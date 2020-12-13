import { useEffect, useState } from "react"
import StripeCheckout from 'react-stripe-checkout'
import useRequest from "../../hooks/use-request"
import  Router  from 'next/router'

const OrderShow=({order,currentUser})=>{
  const [timeLeft,setTimeLeft]=useState(0)
  const {doRequest,errors}=useRequest({
    url:'/api/payments',
    method:'post',
    body:{
      orderId:order.id
    },
    onSuccess:(payment)=> Router.push("/orders")
  }) 

  useEffect(()=>{
    const findTimeLeft=()=>{
      const msLeft=new Date(order.expireAt)-new Date()
      setTimeLeft(Math.round(msLeft/1000))
    }

    findTimeLeft()
    const timerId=setInterval(findTimeLeft,1000)

    return()=>{
      clearInterval(timerId)
    }

  },[]);

  if(timeLeft<0){
    return <div>Order Expired</div>
  }

return <div>Time left to pay {timeLeft} seconds
        <StripeCheckout token={({id})=>{console.log(id);doRequest({token:id})}}
              stripeKey="pk_test_51HvHNcJ0DyuvaMCwW2RpemW7MTNIZMFNZ0Ay66M18HtCzz2fG4z2KzJwONtY6xJGFIoFO3C7XfH7tcNjw0MBomhR000VDOKoR3"   
              amount={order.ticket.price*100}
              email={currentUser.email}
            />
        {errors}
        </div>
}

OrderShow.getInitialProps=async (context,client)=>{    
  const {orderId}=context.query;
  const {data}=await client.get(`/api/orders/${orderId}`)
  return {order:data} 
}

export default OrderShow;