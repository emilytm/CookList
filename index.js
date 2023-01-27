//import { parseResults, searchAll, searchMyRecipes, formatResults, renderResults, search, fetchJson, titleCase, toggleSave } from './utils.js';
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




    /*
    console.log('In load event listener')
    //If myRecipesList doesn't exist yet, create it and store it in localStorage

    let currentList = localStorage.getItem('myRecipesList') ? localStorage.getItem('myRecipesList') : 0
    let currentListLength = currentList ? currentList.length : 0
    
    console.log(`currentList of length ${currentListLength} is ${currentList}`)

    JSON.parse(localStorage.getItem('myRecipesList')).length > 0 ? renderResults():0
    
    
    
        console.log('myRecipesList doesnt exist in localStorage yet')
        let myRecipesList = [{name:'emily'}]
        localStorage.setItem('myRecipesList',JSON.stringify(myRecipesList))
    
    console.log('it already exists in local storage')
    let currentValue = JSON.parse(localStorage.getItem('myRecipesList'))
    console.log(currentValue)
    
    if(window.location.href.indexOf('myrecipes') !== -1){
        console.log('In load event listener on myRecipes page')
        if(JSON.parse(localStorage.getItem('myRecipesList')).length > 0){
            console.log('In load event listener on myRecipes page and the array isnt empty')
            console.log(JSON.parse(localStorage.getItem('myRecipesList')))
            renderResults(JSON.parse(localStorage.getItem('myRecipesList')))
        }
    }*/


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
export async function searchAll(searchTerm){
    //set results to the unformatted array of recipe objects
    let results = await parseResults(searchTerm)
    //set recipeResults to a cleaned version of results
    let recipeResults = formatResults(results)
    //display recipeResults on the page in the results list
    renderResults(recipeResults)
    //store the recipeResults in localStorage as 'recipeResults'
    localStorage.setItem('recipeResults',JSON.stringify(recipeResults))

}

export function searchMyRecipes(searchTerm){

    let recipesToSearch = JSON.parse(localStorage.getItem('myRecipesList'))
    console.log(recipesToSearch)
/*
    let recipeResults = JSON.parse(localStorage.getItem('recipeResults'))
    let searchableList = JSON.parse(localStorage.getItem('myRecipesList'))
    console.log(searchableList)
    console.log(searchTerm)
    if(searchTerm){
        let lowerSearch = searchTerm.toLowerCase()
        console.log(lowerSearch)

        for (let i = 0; i < searchableList.length; i++){
            if(searchableList[i].name.toLowerCase() === lowerSearch){
                console.log(`${searchableList[i].name} matches search term ${lowerSearch}`)
            }
        }

        let recipeMatches = searchableList.filter(recipe => 
            recipe.name.toLowerCase().indexOf(lowerSearch) !== -1)
        console.log(recipeMatches)
        //let filteredRecipes = recipeResults.filter(rec => (rec.saved === true && rec.name.indexOf(searchTerm) !== -1))
        renderResults(recipeMatches)
        console.log(`in searchMyRecipes the recipeResults after searching for ${searchTerm} is:`)
        console.log(`${recipeMatches.map(x => x.name)}`)
    }*/
}
function isAlreadySaved(uniqueUri,currentRecipesList){

    for (let i = 0; i < currentRecipesList.length; i++){
        if(currentRecipesList[i].uniqueUri === uniqueUri){
            return true
        } 
        return false
    }
}

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

export function toggleSave(uniqueUri){
    //get current value of recipeResults from localStorage

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

        /*for (let i = 0; i < currentRecipesList.length; i++){
            console.log(`I'm comparing ${currentRecipesList[i].uniqueUri} to ${uniqueUri} and whether they match is: `)
            if(currentRecipesList[i].uniqueUri === uniqueUri){
                console.log(`recipe is already in list so remove it`)
            } else {
                console.log('recipe is not already in list so add it')
            }
        }/*
        if(currentRecipesList.indexOf.call(recipeToToggle.uniqueUri) !== -1){
            console.log('recipe is found in list so remove it')
        } else {
            console.log('recipe is not found in list so add it')
        }*/
    } else {
        console.log('currentRecipesList doesnt exist, so create it')
    }
    /*
    if(JSON.parse(localStorage.getItem('myRecipesList')).length > 0){
        console.log(JSON.parselocalStorage.hasOwnProperty('myRecipesList'))
        let currentRecipesList = JSON.parse(localStorage.getItem('myRecipesList'))
    } else {
        let currentRecipesList = []
    }
    console.log(`currentRecipesList is ${currentRecipesList}`)
    //find the recipe that the user clicked in the list of results
    const recipeToToggle = currentResults.find(recipe => recipe.uniqueUri === uniqueUri)
    console.log(`recipeToToggle is ${recipeToToggle.name}`)

    //If it is already in myRecipesList, change the button to the 'add' version and remove it from myRecipesList
    if(currentRecipesList.indexOf(recipeToToggle.uniqueUri) !== -1){
        console.log(`it is already in myRecipesList because the index of the recipe is ${currentRecipesList.indexOf(recipeToToggle.uniqueUri)}`)
        let pToChange = document.querySelector(`p[data-recipe="${uniqueUri}"]`)
        let imgToChange = document.querySelector(`img[data-recipe="${uniqueUri}"]`)
        pToChange.textContent = 'My Recipes'
        imgToChange.setAttribute('src','/add.svg')
        currentRecipesList = currentRecipesList.filter(recipe => recipe.uniqueUri !== recipeToToggle.uniqueUri)
        localStorage.setItem('myRecipesList',JSON.stringify(currentRecipesList))

//If it is NOT already in myRecipesList, change the button to the 'remove' version and add it to myRecipesList
    } else {
        console.log(`it is not already in myRecipesList because the index of the recipe is ${currentRecipesList.indexOf(recipeToToggle.uniqueUri)}`)
        let pToChange = document.querySelector(`p[data-recipe="${uniqueUri}"]`)
        let imgToChange = document.querySelector(`img[data-recipe="${uniqueUri}"]`)
        pToChange.textContent = 'Remove'
        imgToChange.setAttribute('src','/remove.svg')
        currentRecipesList.push(recipeToToggle) 
        console.log('it wasnt in the list so I added it and now currentRecipesList is:')
        console.log(currentRecipesList)
        localStorage.setItem('myRecipesList',JSON.stringify(currentRecipesList))

        console.log(JSON.parse(localStorage.getItem('myRecipesList')))
    }

/*
    //If there is no recipe with a URI that matches the one that was clicked, return early
    
    
    const index = currentResults.indexOf(recipeToToggle)

    if(currentResults[index].saved){
        let pToChange = document.querySelector(`p[data-recipe="${currentResults[index].uniqueUri}"]`)
        let imgToChange = document.querySelector(`img[data-recipe="${currentResults[index].uniqueUri}"]`)
        pToChange.textContent = 'My Recipes'
        imgToChange.setAttribute('src','/add.svg')
    } else if (!currentResults[index].saved){
        let pToChange = document.querySelector(`p[data-recipe="${currentResults[index].uniqueUri}"]`)
        let imgToChange = document.querySelector(`img[data-recipe="${currentResults[index].uniqueUri}"]`)
        pToChange.textContent = 'Remove'
        imgToChange.setAttribute('src','/remove.svg') 
    }
    currentResults[index].saved = !currentResults[index].saved
    localStorage.setItem('recipeResults',JSON.stringify(recipeResults))
    console.log(`in toggleSave the recipeResults after toggling save for ${recipeToToggle.name} is:`)
    console.log(`${JSON.parse(localStorage.getItem('recipeResults'))}`)
*/
}

export async function search(searchString){
    let getResults = await fetchJson(`https://api.edamam.com/api/recipes/v2?type=any&beta=true&q=${searchString}&app_id=08159f45&app_key=%207cde058d95c392d413b4017227de3d3a`)
    return getResults.hits
}

export async function parseResults(searchTerm){
    let searchString = searchTerm.replaceAll(' ','%20')
    let matchResults = await search(searchString)
    let rawResults = []
    for (let hit of matchResults){
        rawResults.push({
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
            uniqueUri: hit.recipe.shareAs,
            saved: false
        })
    }
    return rawResults
}

export async function fetchJson(url){
    let result = await fetch(url)
    return result.json()
}
/*
export function selectArray(recipeList) {
    if(window.location.href.indexOf('myrecipes') > -1) {
        return recipeList.filter(x => x.saved)
    } else {
        return recipeList
    }
}
*/

export function renderResults(recipeArray) {
    if(recipeArray.length >= 1){  
        document.getElementById('message-display').classList.add('hidden')
        let resultsHtml = ""
        //recipeArray = selectArray(recipeArray)
        for ( let recipe of recipeArray ) {
            let imageLink = recipe.image
            let ingredients = []
            recipe.ingredients.forEach(food => {
                ingredients.push(food.text)
            })
            let interactionIcon
            let interactionText
            let interactionAlt
            if (recipe.saved) {
                interactionIcon = '/remove.svg'
                interactionText = 'Remove'
                interactionAlt = 'Remove icon for Remove from My Recipes button'
            } else {
                interactionIcon = '/add.svg'
                interactionText = 'My Recipes'
                interactionAlt = 'Add icon for Add to My Recipes button'
            }
            let ingredientString = ingredients.join(", ")
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

export function formatResults(recipeResults){
    recipeResults.forEach(recipe => {
        recipe.name = titleCase(recipe.name)
        recipe.source = titleCase(recipe.source)
        recipe.mealType = recipe.mealType.map(type => titleCase(type))
        recipe.cuisine = recipe.cuisine.map(cuisine => titleCase(cuisine))
        recipe.dishType = recipe.dishType.map( item => titleCase(item))
        recipe.uniqueUri = formatUri(recipe.uniqueUri)
    })
    return recipeResults
}

export function titleCase(string) {
    return string.slice(0,1).toUpperCase() + string.slice(1)
}

export function renderNoResultState(){
    document.getElementById('results-list').innerHTML = ""
    document.getElementById('message-display').innerHTML = `
        <p class='empty-state-message'> Unable to find what you're looking for. Please try another search.</p>
    `
}

export function formatUri(uniqueUri){
    let indices = []
    for (let i = 0; i < uniqueUri.length; i++){
        if(uniqueUri[i] === "/"){
            indices.push(i)
        }
    }
    return uniqueUri.slice(0,indices[indices.length-1])
}