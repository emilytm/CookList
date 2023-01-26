
export async function searchAll(searchTerm,recipesList){
    let results = await parseResults(searchTerm)
    recipesList = formatResults(results)
    renderResults(recipesList)
    localStorage.setItem('recipesList',JSON.stringify(recipesList))
    console.log(`in searchAll the recipesList after searching for ${searchTerm} is:`)
    console.log(`${JSON.parse(localStorage.getItem('recipesList'))}`)
    return recipesList
}

export function searchMyRecipes(searchTerm){
    let recipesList = JSON.parse(localStorage.getItem('recipesList'))
    if(searchTerm){
        let filteredRecipes = recipesList.filter(rec => (rec.saved === true && rec.name.indexOf(searchTerm) !== -1))
        renderResults(filteredRecipes)
        console.log(`in searchMyRecipes the recipesList after searching for ${searchTerm} is:`)
        console.log(`${filteredRecipes.map(x => x.name)}`)
    }
}

export function toggleSave(uniqueUri){
    let recipesList = JSON.parse(localStorage.getItem('recipesList'))
    const recipeToToggle = recipesList.find(recipe => recipe.uniqueUri === uniqueUri)
    if (!recipeToToggle) return
    const index = recipesList.indexOf(recipeToToggle)

    if(recipesList[index].saved){
        let pToChange = document.querySelector(`p[data-recipe="${recipesList[index].uniqueUri}"]`)
        let imgToChange = document.querySelector(`img[data-recipe="${recipesList[index].uniqueUri}"]`)
        pToChange.textContent = 'My Recipes'
        imgToChange.setAttribute('src','/add.svg')
    } else if (!recipesList[index].saved){
        let pToChange = document.querySelector(`p[data-recipe="${recipesList[index].uniqueUri}"]`)
        let imgToChange = document.querySelector(`img[data-recipe="${recipesList[index].uniqueUri}"]`)
        pToChange.textContent = 'Remove'
        imgToChange.setAttribute('src','/remove.svg') 
    }
    recipesList[index].saved = !recipesList[index].saved
    localStorage.setItem('recipesList',JSON.stringify(recipesList))
    console.log(`in toggleSave the recipesList after toggling save for ${recipeToToggle.name} is:`)
    console.log(`${JSON.parse(localStorage.getItem('recipesList')).filter(item => item.saved)}`)
}

export async function search(searchString){
    let getResults = await fetchJson(`https://api.edamam.com/api/recipes/v2?type=any&beta=true&q=${searchString}&app_id=08159f45&app_key=%207cde058d95c392d413b4017227de3d3a`)
    return getResults.hits
}

export async function parseResults(searchTerm){
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
            uniqueUri: hit.recipe.shareAs,
            saved: false
        })
    }
    return recipeResults
}

export async function fetchJson(url){
    let result = await fetch(url)
    return result.json()
}

export function selectArray(recipeList) {
    if(window.location.href.indexOf('myrecipes') > -1) {
        return recipeList.filter(x => x.saved)
    } else {
        return recipeList
    }
}

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
        recipe.dishType = recipe.dishType.map( item => titleCase(item) )
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