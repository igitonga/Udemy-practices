import styles from './meal-grid.module.css';
import MealItem from './meal-item';

export default function MealGrid({meals}){
    return (
        <ul className={styles.meals}>
            {meals.map(meal => 
                <li key={meal.id}>
                    <MealItem 
                        title={meal.title} 
                        slug={meal.slug}
                        image={meal.image}
                        summary={meal.summary}
                        creator={meal.creator}
                    />
                </li>   
            )}
        </ul>
    )
}