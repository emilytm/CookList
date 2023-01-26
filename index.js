import { parseResults, searchAll, searchMyRecipes, formatResults, renderResults, search, fetchJson, titleCase, toggleSave } from './utils.js';
let searchArea = document.getElementById('search-wrapper')
var recipesList = []

/*document.addEventListener('DOMContentLoaded',() => {
    if(window.location.href.indexOf('myrecipes') !== -1){
        if(JSON.parse(localStorage.getItem('recipesList')).length > 0){
            renderResults(JSON.parse(localStorage.getItem('recipesList')).filter(rec => rec.saved === true))
        }
    }
})*/

searchArea.addEventListener('submit', async function(e){
    e.preventDefault()
    let searchTerm = searchArea.elements[0].value
    
    if(window.location.href.indexOf('myrecipes') !== -1) {
        searchMyRecipes(searchTerm,recipesList)
    } else {
        recipesList = await searchAll(searchTerm,recipesList)
    }
})

document.addEventListener('click',function(e) {
    if(e.target.dataset.recipe){
        toggleSave(e.target.dataset.recipe)
    }
})











