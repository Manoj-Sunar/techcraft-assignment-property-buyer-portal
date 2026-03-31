'use client'

import { cn } from '@/app/utils/cn';
import { memo } from 'react';


interface IinputFieldProps {
    type: string;
    value: string;
    setValue: Function;
    placeholder?:string;
    className?: string;
}

const InputField =memo( ({ type, value, setValue, className,placeholder }: IinputFieldProps) => {

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className={cn("w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all", className)}
        />
    )
})

export default InputField
