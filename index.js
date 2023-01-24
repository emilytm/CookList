
document.addEventListener('DOMContentLoaded',(e) => {
    console.log(e.target)
    //if(e.target.dataset.toggle){
    //    console.log('add or remove')
    //}
})

let searchArea = document.getElementById('search-wrapper')

searchArea.addEventListener('submit', async function(e){
    e.preventDefault()
    let searchTerm = searchArea.elements[0].value
    document.getElementById('message-display').classList.add('hidden')
    let results = await parseResults(searchTerm)
    results = formatResults(results)
    renderResults(results)
})

async function search(searchString){

    let getResults = await fetchJson(`https://api.edamam.com/api/recipes/v2?type=any&beta=true&q=${searchString}&app_id=08159f45&app_key=%207cde058d95c392d413b4017227de3d3a`)
    return getResults.hits

}

async function parseResults(searchTerm){

    let searchString = searchTerm.replaceAll(' ','%20')
    let matchResults = await search(searchString)
    let recipeResults = []

    for (let hit of matchResults){
        recipeResults.push({
            name: hit.recipe.label,
            link: hit.recipe.url,
            source: hit.recipe.source,
            mealType: hit.recipe.mealType,
            ingredients: hit.recipe.ingredients,
            cuisine: hit.recipe.cuisineType,
            dishType: hit.recipe.dishType,
            healthLabels: hit.recipe.healthLabels,
            image: hit.recipe.image,
            images: hit.recipe.images,
            yield: hit.recipe.yield,
            time: hit.recipe.totalTime,
            cautions: hit.recipe.cautions,
            uniqueUri: hit.recipe.shareAs
        })
    }
    return recipeResults

}

async function fetchJson(url){

    let result = await fetch(url)
    return result.json()

}

function renderResults(searchResults) {
    let resultsHtml = ""
    for ( let recipe of searchResults ) {
        let imageLink = recipe.image
        let ingredients = []
        recipe.ingredients.forEach(food => {
            ingredients.push(food.text)
        });
        let ingredientString = ingredients.join(", ")
        resultsHtml += `
        <div class="result-item" data-recipe="${recipe.uniqueUri}">
            <img class="result-img" alt="recipe image for Tahini Shortbread Cookies" src="${imageLink}">
            <p class="title first-row left-align">${recipe.name}</p>
            <div class='list-toggle-btn' id='list-toggle-btn' data-toggle="my-recipes">
                <img class='list-toggle-icon' id='list-toggle-icon' src="/add.svg" alt="add/remove icon" data-toggle="my-recipes">
                <p class="list-toggle-text" data-toggle="my-recipes">My Recipes</p>
            </div>
            <p class="source left-align"><a href="${recipe.link}">${recipe.source}</a></p>
            <p class="tags left-align">${recipe.mealType}, ${recipe.dishType}</p>
            <p class="cuisine">${recipe.cuisine}</p>
            <p class="ingredient-preview left-align end-in-ellipse">${ingredientString}</p>
        </div>        
        `
    }
    document.getElementById('results-list').innerHTML = resultsHtml
}

function formatResults(recipeResults){
    recipeResults.forEach(recipe => {
        recipe.name = titleCase(recipe.name)
        recipe.source = titleCase(recipe.source)
        recipe.mealType = recipe.mealType.map(type => titleCase(type))
        recipe.cuisine = recipe.cuisine.map(cuisine => titleCase(cuisine))
        recipe.dishType = recipe.dishType.map( item => titleCase(item) )
    })

    return recipeResults
}

function titleCase(string) {
    return string.slice(0,1).toUpperCase() + string.slice(1)
}