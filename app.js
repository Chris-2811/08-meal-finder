const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');


// Fetch meals from API
async function searchMeal(e) {
  e.preventDefault()
  const term = search.value

  if(term.trim()) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}
    `)
    const data = await response.json()

    single_mealEl.innerHTML = ''
    resultHeading.innerHTML = `<h2>Search results for ${term}</h2>`

    if(data.meals === null) {
      resultHeading.innerHTML= 'There are no search results. Try again!'
    } else {
      mealsEl.innerHTML = data.meals
      .map(meal => {
        return `
          <div class="meal">
            <img src="${meal.strMealThumb}"/>
            <div class="meal-info" data-id="${meal.idMeal}">
              <h3 class="meal-heading" data-id="${meal.idMeal}">${meal.strMeal}</h3>
            </div>
          </div>
        `
      }).join('')
    }

    search.value = ''

  } else {
    alert('Please enter a search term')
  }
}

// Fetch random meal from API
async function getRandomMeal() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const data = await response.json();

  const meal = data.meals[0]
  addToDOM(meal)
}

// Add meal to DOM
function addToDOM(meal) {
  const ingredients = [];

  for(let i = 1; i <= 20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      )
    } else {
      break;
    }
  } 


  resultHeading.innerHTML = ''
  mealsEl.innerHTML = ''

  single_mealEl.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
  <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
  </div>
  <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
      ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
  </div>
</div>
  `
}

// Fetch meal by id from API
async function getMealById(id) {
 const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}
 `)

 const data = await response.json()

 const meal = data.meals[0]
 addToDOM(meal)
}

// Add Eventlistener
submit.addEventListener('submit', searchMeal)
random.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e=> {
if(e.target.classList.contains('meal-info') || 
  e.target.classList.contains('meal-heading')) {
    const id = e.target.getAttribute('data-id')

    getMealById(id)
  } 
})

// Solution 2

/* let composed = e.composedPath();

  composed = composed.find(item => {
    if(item.classList) {
      return item.classList.contains('meal-info')
    } else  {
      return false
    }
  })

  if(composed) {
    const mealID = composed.getAttribute('data-mealID')

    getMealById(mealID)
  } */


  