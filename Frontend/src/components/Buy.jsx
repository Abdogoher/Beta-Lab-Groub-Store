import React from 'react'
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const Buy = () => {
  return (
    <section className='py-10 bg-slate-100 rounded-2xl'>
        <div className='container mx-auto'>
            <h2 className='text-center text-3xl font-bold text-gray-800 dark:text-white mb-6'>لي تشتري من Beta medical</h2>
        <div className='flex justify-between mx-auto items-center mt-20'>
            <div className='flex flex-col items-center'>
                <FaHandshakeSimple className='text-6xl text-gray-800 dark:text-white mb-2 bg-cyan-100 p-2 rounded-full' />
                <p className='text-center text-3xl font-bold text-gray-800 dark:text-white mb-4'>
                    خدمة ما بعد البيع 
                </p>
                <p className='text-center text-gray-600 dark:text-gray-400'>
                    فريق مختص لمساعدتك والرد علي استفسارك
                </p>
            </div>
            <div className='flex flex-col items-center'>
                <FaMoneyBillAlt className='text-6xl text-gray-800 dark:text-white mb-2 bg-cyan-100 p-2 rounded-full' />
                <p className='text-center text-3xl font-bold text-gray-800 dark:text-white mb-4'>
                    أفضل سعر مقابل أفضل جودة 
                </p>
                <p className='text-center text-gray-600 dark:text-gray-400'>
                    وفر فلوسك واشتري بأفضل سعر في مصر
                </p>
            </div>
            <div className='flex flex-col items-center'>
                <IoShieldCheckmarkSharp className='text-6xl text-gray-800 dark:text-white mb-2 bg-cyan-100 p-2 rounded-full' />
                <p className='text-center text-3xl font-bold text-gray-800 dark:text-white mb-4'>
                    منتجات أمنة 100%
                </p>
                <p className='text-center text-gray-600 dark:text-gray-400'>
                    كل منتجات Beta medical أمنة 100% ومصرح بها من وزارة الصحة
                </p>
            </div>
        </div>
        </div>
    </section>
  )
}

export default Buy