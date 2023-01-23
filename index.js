
document.addEventListener('DOMContentLoaded',(e) => {
    console.log(e)
})

let searchArea = document.getElementById('search-wrapper')

searchArea.addEventListener('submit', async function(e){
    e.preventDefault()
    let searchTerm = searchArea.elements[0].value
    document.getElementById('message-display').classList.add('hidden')
    renderResults(await parseResults(searchTerm))
})

async function search(searchString){

    let getResults = await fetchJson(`https://api.edamam.com/api/recipes/v2?type=any&beta=true&q=${searchString}&app_id=08159f45&app_key=%207cde058d95c392d413b4017227de3d3a`)
    console.log(getResults)
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
            ingredients: hit.recipe.ingredients,
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
        console.log(recipe.ingredients)
        recipe.ingredients.forEach(food => {
            ingredients.push(food.text)
        });
        console.log(ingredients)
        let ingredientString = ingredients.join(", ")
        resultsHtml += `
        <div class="result-item" data-recipe="${recipe.uniqueUri}">
            <img class="result-img" alt="recipe image for Tahini Shortbread Cookies" src="${imageLink}">
            <p class="title">${recipe.label}</p>
            <p class="add-to-list-btn">My Recipes</p>
            <p class="source">${recipe.source}</p>
            <p class="tags">${recipe.mealType}, ${recipe.dishType}</p>
            <p class="cuisine">${recipe.cuisine}</p>
            <p class="ingredient-preview">${ingredientString}</p>
        </div>        
        `
    }
    document.getElementById('results-list').innerHTML = resultsHtml
}

/*
                    <div class="result-item">
                        <img class="result-img" alt="recipe image for Tahini Shortbread Cookies" src="">
                        <p class="title">Tahini Shortbread Cookies</p>
                        <p class="add-to-list-btn">My Recipes</p>
                        <p class="source">Food52</p>
                        <p class="tags">Entree</p>
                        <p class="cuisine">French</p>
                        <p class="ingredient-preview">Blah blah and blah bsdlkfj asdfj eioru alskdj lak alksjd ei dal</p>
                    </div>
                    */