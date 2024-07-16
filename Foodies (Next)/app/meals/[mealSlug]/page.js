import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';

export default function MealDetailsPage({params}){
    const meal = getMeal(params.mealSlug);

    if(!meal)
        notFound();

    meal.instructions = meal.instructions.replace(/\n/g, '<br />');

    return (
        <>
            <header className={styles.header}>
                <div className={styles.image}>
                    <Image src={meal.image} fill/>
                </div>
                <div className={styles.headerText}>
                    <h1>{meal.title}</h1>
                    <p className={styles.creator}>
                        by <Link href={`mailto:${meal.creator_email}`}>{meal.creator}</Link>
                    </p>
                    <p className={styles.summary}>{meal.summary}</p>
                </div>
            </header>
            <main>
                <p className={styles.instructions} 
                dangerouslySetInnerHTML={{ __html: meal.instructions }}></p>
            </main>
        </>
    )
}