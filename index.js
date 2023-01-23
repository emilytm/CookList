console.log('whatup')


console.log(await parseResults('Tahini'))

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
            ingredients: hit.recipe.ingredients
        })
    }

    return recipeResults

}

async function fetchJson(url){

    let result = await fetch(url)
    return result.json()

}