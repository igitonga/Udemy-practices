import Link from "next/link";

export default function MealPage(){
    return (
        <>
            <h1>Meal Page</h1>
            <ul>
                <li>
                    <Link href='meals/plan-1'>Plan 1</Link>
                </li>
                <li>
                    <Link href='meals/plan-2'>Plan 2</Link>
                </li>
            </ul>
        </>
    )
}