import React from 'react'

function Input({type,placeholder,setUserData,value, field, icon}) {
  return (
   <div className='relative w-full '>
         <i 
         className={
          "fi  "+
          icon +
          "   absolute top-1/2 -translate-y-1/2 mt-1 left-4 opacity-50"}></i>
   <input
                    value={value}
                    type={type}
                    className="w-full h-[50px] pl-10  text-black text-xl p-2 rounded-full focus:outline-none border "
                    placeholder={placeholder}
                    onChange={(e) =>
                    setUserData((prev) =>({
                      ...prev,
                      [field]:e.target.value,
                    }))}
                  />
   </div>
  )
}

export default Input