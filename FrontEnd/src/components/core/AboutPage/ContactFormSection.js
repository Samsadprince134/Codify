import React from 'react'
import ContactusForm from '../../common/ContactusForm'
export default function ContactFormSection() {
  return (
    <div className='flex flex-col justify-center items-center'>
        <h1 className='font-bold text-4xl text-center'>Get in Touch</h1>
        <p className='text-richblack-300 mt-2 '>We'd love to here for you, Please fill out this form</p>
        <div className='flex justify-center items-center mx-auto'>
           <ContactusForm></ContactusForm>
        </div>
    </div>
  )
}
