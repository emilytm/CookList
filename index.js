//import { parseResults, searchAll, searchMyRecipes, formatResults, renderResults, search, fetchJson, sentenceCase, toggleSave } from './utils.js';
let searchArea = document.getElementById('search-wrapper')

document.addEventListener('DOMContentLoaded',() => {

    if(window.location.href.indexOf('myrecipes') !== -1){
        if (localStorage.getItem('myRecipesList')){
            renderResults(JSON.parse(localStorage.getItem('myRecipesList')))
        } else {
            console.log('list is empty')
        }
    }
})

searchArea.addEventListener('submit', async function(e){
    e.preventDefault()
    let searchTerm = searchArea.elements[0].value
    if(searchTerm) {
        window.location.href.indexOf('myrecipes') !== -1 ?  searchMyRecipes(searchTerm) : searchAll(searchTerm)
    }
})

document.addEventListener('click',function(e) {
    if(e.target.dataset.recipe){
        toggleSave(e.target.dataset.recipe)
    }
})






//http://www.edamam.com/recipe/the-crispy-egg-db742742099859a8053b992dd3c1f452/crispy+egg

//http://www.edamam.com/recipe/the-crispy-egg-db742742099859a8053b992dd3c1f452/egg"



/*
When on the Find Recipes page, when the user executes a search, get the results from the 
API, format them, then render them on the page. Then save the results to the recipeResults
localStorage item
*/
async function searchAll(searchTerm){

    //set results to the unformatted array of recipe objects
    let results = await parseResults(searchTerm)
    //set recipeResults to a cleaned version of results
    let recipeResults = formatResults(results)
    //display recipeResults on the page in the results list
    renderResults(recipeResults)
    //store the recipeResults in localStorage as 'recipeResults'
    localStorage.setItem('recipeResults',JSON.stringify(recipeResults))

}

/*

*/
function searchMyRecipes(searchTerm){

    if(localStorage.getItem('myRecipesList')){
        var recipesToSearch = JSON.parse(localStorage.getItem('myRecipesList'))
        if(recipesToSearch.length > 0){
            let searchResults = recipesToSearch.filter(recipe => recipe.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
            renderResults(searchResults)
        }
    }
}

/*

*/
function isAlreadySaved(uniqueUri,currentRecipesList){

    for (let i = 0; i < currentRecipesList.length; i++){
        if(currentRecipesList[i].uniqueUri === uniqueUri){
            return true
        } 
        return false
    }
}

/*

*/
function addToList(recipeToToggle,currentRecipesList,imgToChange,pToChange){
    console.log('adding to list')

    pToChange.textContent = 'Remove'
    imgToChange.setAttribute('src','/remove.svg')

    currentRecipesList.push(recipeToToggle) 
    localStorage.setItem('myRecipesList',JSON.stringify(currentRecipesList))

    console.log(`The item I just added to currentRecipesList (new length is ${currentRecipesList.length}) is: ${recipeToToggle.name}`)
    console.log(`the ${currentRecipesList.length} items currently in currentRecipesList are: `)
    currentRecipesList.forEach(recipe => console.log(recipe.name))
}

/*

*/
function removeFromList(recipeToToggle,currentRecipesList,imgToChange,pToChange){
    console.log('removing from list')

    pToChange.textContent = 'My Recipes'
    imgToChange.setAttribute('src','/add.svg')

    console.log(`the ${currentRecipesList.length} items currently in currentRecipesList are: `)
    currentRecipesList.forEach(recipe => console.log(recipe.name))
    
    currentRecipesList = currentRecipesList.filter(recipe => recipe.uniqueUri !== recipeToToggle.uniqueUri)
    
    console.log(`The item I just removed from currentRecipesList (new length is ${currentRecipesList.length}) is: ${recipeToToggle.name}`)
    console.log(`the ${currentRecipesList.length} items currently in currentRecipesList are: `)
    currentRecipesList.forEach(recipe => console.log(recipe.name))

    localStorage.setItem('myRecipesList',JSON.stringify(currentRecipesList))

}

/*

*/
function toggleSave(uniqueUri){

    if(localStorage.getItem('recipeResults')){
        var currentResults = JSON.parse(localStorage.getItem('recipeResults'))
        console.log(`currentResults is ${currentResults}`)
    }

    if(localStorage.getItem('myRecipesList')){
        var currentRecipesList = JSON.parse(localStorage.getItem('myRecipesList'))
        if(currentRecipesList.length > 0){
            console.log('at least 1 item in the list')
        }
    }

    const recipeToToggle = currentResults.find(recipe => recipe.uniqueUri === uniqueUri)
    console.log(recipeToToggle)

    if(currentRecipesList){
        console.log('currentRecipesList exists, so search through it')
        console.log(`recipe uri I'm searching for is: ${uniqueUri}`)
        var imgToChange = document.querySelector(`img[data-recipe="${uniqueUri}"]`)
        var pToChange = document.querySelector(`p[data-recipe="${uniqueUri}"]`)
        if(isAlreadySaved(uniqueUri,currentRecipesList)){
            removeFromList(recipeToToggle,currentRecipesList,imgToChange,pToChange)
        } else {
            addToList(recipeToToggle,currentRecipesList,imgToChange,pToChange)
        }
        console.log('currentRecipesList contains: ')
        console.log(JSON.parse(localStorage.getItem('currentRecipesList')))

    } else {
        let startList = [recipeToToggle]
        localStorage.setItem('myRecipesList',JSON.stringify(startList))
    }
}

/*

*/
async function search(searchString){
    let getResults = await fetchJson(`https://api.edamam.com/api/recipes/v2?type=any&beta=true&q=${searchString}&app_id=08159f45&app_key=%207cde058d95c392d413b4017227de3d3a`)
    return getResults.hits
}

/*

*/
async function parseResults(searchTerm){
    let searchString = searchTerm.replaceAll(' ','%20')
    let matchResults = await search(searchString)
    let rawResults = []
    for (let hit of matchResults){
        rawResults.push({
            name: hit.recipe?.label,
            link: hit.recipe?.url,
            source: hit.recipe?.source,
            mealType: hit.recipe?.mealType,
            ingredients: hit.recipe?.ingredients,
            cuisine: hit.recipe?.cuisineType,
            dishType: hit.recipe?.dishType,
            healthLabels: hit.recipe?.healthLabels,
            image: hit.recipe?.image,
            images: hit.recipe?.images,
            yield: hit.recipe?.yield,
            time: hit.recipe?.totalTime,
            cautions: hit.recipe?.cautions,
            uniqueUri: hit.recipe?.shareAs,
            saved: false
        })
    }
    return rawResults
}

/*

*/
async function fetchJson(url){
    let result = await fetch(url)
    return result.json()
}

/*
Take in an array of recipe objects and display them in the results list if there are any
If there are none, call renderNoResultState() to display a no-results state
*/
function renderResults(recipeArray) {
    if(recipeArray.length >= 1){  
        document.getElementById('message-display').classList.add('hidden')
        let resultsHtml = ""
        for ( let recipe of recipeArray ) {
            let imageLink = recipe.image
            
            //Format the array of ingredients as a comma separated string
            let ingredients = []
            recipe.ingredients.forEach(food => {
                ingredients.push(food.text)
            })
            let ingredientString = ingredients.join(", ")

            let interactionIcon
            let interactionText
            let interactionAlt

            if (localStorage.getItem('myRecipesList')){
                if (isAlreadySaved(recipe.uniqueUri, JSON.parse(localStorage.getItem('myRecipesList')))){
                    interactionIcon = '/remove.svg'
                    interactionText = 'Remove'
                    interactionAlt = 'Remove icon for Remove from My Recipes button'                    
                }
             } else {
                    interactionIcon = '/add.svg'
                    interactionText = 'My Recipes'
                    interactionAlt = 'Add icon for Add to My Recipes button'
            }    

            resultsHtml += `
            <div class="result-item">
                <img class="result-img" alt="recipe image for Tahini Shortbread Cookies" src="${imageLink}">
                <p class="title first-row left-align">${recipe.name}</p>
                <div class='list-toggle-btn' id='list-toggle-btn' data-recipe="${recipe.uniqueUri}">
                    <img class='list-toggle-icon' id='list-toggle-icon' src="${interactionIcon}" alt="${interactionAlt}" data-recipe="${recipe.uniqueUri}">
                    <p class="list-toggle-text" id="list-toggle-text" data-recipe="${recipe.uniqueUri}">${interactionText}</p>
                </div>
                <p class="source left-align"><a href="${recipe.link}">${recipe.source}</a></p>
                <p class="tags left-align">${recipe.mealType}, ${recipe.dishType}</p>
                <p class="cuisine">${recipe.cuisine}</p>
                <p class="ingredient-preview left-align end-in-ellipse">${ingredientString}</p>
            </div>        
            `
        }
        document.getElementById('results-list').innerHTML = resultsHtml
    } else {
        renderNoResultState()
    }
}

/*
Take in a recipe object and return it with it's properties appropriately capitalized
*/
function formatResults(recipeResults){
    recipeResults.forEach(recipe => {
        recipe.name = sentenceCase(recipe.name)
        recipe.source = sentenceCase(recipe.source)
        recipe.mealType = recipe.mealType.map(type => sentenceCase(type))
        recipe.cuisine = recipe.cuisine.map(cuisine => sentenceCase(cuisine))
        recipe.dishType = recipe.dishType.map( item => sentenceCase(item))
        recipe.uniqueUri = formatUri(recipe.uniqueUri)
    })
    return recipeResults
}

/*
Take in a string and return the same string where the first letter is capitalized
Used to format recipe titles and other attributes with inconsistent formatting
*/
function sentenceCase(string) {
    return string.slice(0,1).toUpperCase() + string.slice(1)
}

/*
Display a no-results message if a user's search returns no results
*/
function renderNoResultState(){
    document.getElementById('results-list').innerHTML = ""
    document.getElementById('message-display').innerHTML = `
        <p class='empty-state-message'> Unable to find what you're looking for. Please try another search.</p>
    `
}

/*
Take in the uniqueUri and remove the characters after the final '/'
Used to remove indication of which API call the URI was returned by, thus making the URI unique to the recipe
and the same for all instances of that recipe
*/
function formatUri(uniqueUri){
    let indices = []
    for (let i = 0; i < uniqueUri.length; i++){
        if(uniqueUri[i] === "/"){
            indices.push(i)
        }
    }
    return uniqueUri.slice(0,indices[indices.length-1])
}