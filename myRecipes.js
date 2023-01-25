/*import { renderResults } from "./utils"

export function searchMyRecipes(searchTerm) {
    console.log('in searchMyRecipes')
    if(searchTerm){
        let filteredRecipes = recipesList.map(rec => rec.saved)
        renderResults(filteredRecipes)
    }
}




let searchArea = document.getElementById('search-wrapper')
let recipeList = []

searchArea.addEventListener('submit', async function(e){
    e.preventDefault()
    let searchTerm = searchArea.elements[0].value
    document.getElementById('message-display').classList.add('hidden')
    let results = await parseResults(searchTerm)
    recipeList = formatResults(results)
    renderResults(recipeList)
})

document.addEventListener('click',function(e) {
    if(e.target.dataset.recipe){
        let clickedRecipe = recipeList.find(result => result.uniqueUri === e.target.dataset.recipe)
        if( clickedRecipe.saved ){
            clickedRecipe.saved = false
            let pToChange = document.querySelector(`p[data-recipe="${clickedRecipe.uniqueUri}"]`)
            let imgToChange = document.querySelector(`img[data-recipe="${clickedRecipe.uniqueUri}"]`)
            pToChange.textContent = 'My Recipes'
            imgToChange.setAttribute('src','/add.svg')      
        } else if ( !clickedRecipe.saved){
            clickedRecipe.saved = true
            let pToChange = document.querySelector(`p[data-recipe="${clickedRecipe.uniqueUri}"]`)
            let imgToChange = document.querySelector(`img[data-recipe="${clickedRecipe.uniqueUri}"]`)
            pToChange.textContent = 'Remove'
            imgToChange.setAttribute('src','/remove.svg')   
        }
    }
})
*/