import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;


function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src
        script.onload = () =>  {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
    
}

export async function buyCourse(token , courses , userDetails , navigate , dispatch){
    const toastId = toast.loading("Loading...")
    try{
        // load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("Razorpay SDK Failed to load")
            return
        }


        // initiate the order
        const orderResponse = await apiConnector("POST" , COURSE_PAYMENT_API, {courses},
         {
            Authorization : `Bearer ${token}`,
        })
        if(!orderResponse){
            throw new Error(orderResponse.data.message)
        }
        console.log("order response " , orderResponse)


        const options = {
            key: "rzp_test_pDNyh4RMw2bfx9", // Enter the Key ID generated from the Dashboard
            amount: `${orderResponse.data.data.amount}`,
            currency: orderResponse.data.data.currency,
            name: "Codify",
            description: "Thank you for purchasing the course",
            image: { rzpLogo },
            order_id: orderResponse.data.data.id,
            prefill: {
                name: `${userDetails.FirstName}`,
                email: `${userDetails.Email}`,
               // contact: "9999999999",
            },
            handler: function (response) {

                // send succesful wala mail
               sendPaymentSuccessEmail(response , orderResponse.data.data.amount , token)

                // verify payment

                verifyPayment({...response , courses} , token , navigate , dispatch)
                
            },
           
            // notes: {
            //     address: "Soumya Dey Corporate Office",
            // },
            // theme: {
            //     color: "#61dafb",
            // },
        };
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
        paymentObject.on("Payment.failed" , function(response){
            toast.error("Oops, Payment Failed")
            console.log(response.error)
        })

    }
    catch(error){

        console.log("PAYMENT API ERROR" , error)
        toast.error("Could not make payment")

    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response , amount , token){
    try{

        await apiConnector("POST" , SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId : response.razorpay_order_id,
            paymentId : response.razorpay_payment_id,
            amount,
        }, {
            Authorization : `Bearer ${token}`
        })

    }
    catch(error){
        console.log("Payment success email error")

    }
}

async function verifyPayment(bodyData , token , navigate , dispatch){
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true));
    try{
        const response = await apiConnector("POST" , COURSE_VERIFY_API , bodyData, {
            Authorization : `Bearer ${token}`
        })


        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Payment Succcessful, You are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart())

    }
    catch(error){
        console.log("PAYMENT VERIFY ERROR --- >" , error)
        toast.error("Could not verify payment")

    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))

}
