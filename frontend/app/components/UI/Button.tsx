import { cn } from '@/app/utils/cn';
import { ArrowRight } from 'lucide-react'

interface IButtonProps {
    type:"submit"|"reset"|"button";
    loading?: boolean;
    isLogin?: boolean;
    className?:string;
}

const Button = ({ type, loading, isLogin ,className}: IButtonProps) => {
    return (
        <button
            type={type}
            disabled={loading}
            className={cn("w-full text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2  transition-all shadow-xs disabled:opacity-50",className)}
        >
            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
            {!loading && <ArrowRight size={20} />}
        </button>
    )
}

export default Button
