const gettingElements = (selector) => document.querySelector(selector);

const MealElement = (meal) => {
  const meall = document.createElement("div");
  meall.className = "meal";
  meall.innerHTML = `<img src="${meal.strMealThumb}" alt="meal-image"><h3>${meal.strMeal}</h3>`;
  meall.addEventListener("click", () => ingredientsModal(meal.idMeal));
  return meall;
};

const ingredientsModal = async (mealId) => {
  const { meals } = await fetchingJson(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const Ingredients = Object.entries(meals[0])
    .filter(([key, value]) => key.startsWith("strIngredient") && value)
    .map(([, value]) => `<li>${value}</li>`)
    .join("");
  gettingElements(".Modal").innerHTML = `<h3>Ingredients</h3><ul>${Ingredients}</ul>`;
  gettingElements(".Modal").style.display = "block";
};

const fetchingJson = async (url) => (await fetch(url)).json();
const fetchingMeal = async () => {
  const { meals } = await fetchingJson("https://www.themealdb.com/api/json/v1/1/random.php");
  gettingElements(".Randomm").innerHTML = "";
  gettingElements(".Randomm").appendChild(MealElement(meals[0]));
};

const fetchMealsByCategory = async (category) => {
  const { meals } = await fetchingJson(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  gettingElements(".Meals").innerHTML = "";
  if (meals) {
    meals.forEach((meal) => gettingElements(".Meals").appendChild(MealElement(meal)));
  } 
};
gettingElements(".Search-Button").addEventListener("click", () => {
  const category = gettingElements(".Input").value;
  gettingElements("#Results").innerHTML = `Search Results for ${category}`;
  fetchMealsByCategory(category);
});

gettingElements(".Input").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const category = gettingElements(".Input").value;
    gettingElements("#Results").innerHTML = `Search Results for ${category}`;
    fetchMealsByCategory(category);
  }
});

window.onclick = (e) => {
  const ingredientModal = gettingElements(".Modal");
  if (e.target == ingredientModal || ingredientModal.contains(e.target)) {
    ingredientModal.style.display = "none";
  }
};

fetchingMeal();