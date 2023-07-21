interface meal {
  id: string
  name: string
  description: string
  date_time: string
  diet: string
  user_id: string
  created_at: string
}

export function bigSequence(meals: meal[]) {
  let count = 0
  let total = 0

  meals.forEach((meal) => {
    if (meal.diet === 'true') {
      count += 1
    } else {
      total = count > total ? count : total
      count = 0
    }
  })

  if (count > total) {
    return count
  } else {
    return total
  }
}
