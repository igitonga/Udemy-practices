'use client';
import { useFormStatus } from 'react-dom';

export default function ShareMealButton(){
    const { pending } = useFormStatus();
    return(
        <button type='submit'>{pending ? 'Share Meal' : 'Submitting'}</button>
    )
}