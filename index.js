import { parseResults, searchAll, searchMyRecipes, formatResults, renderResults, search, fetchJson, titleCase, toggleSave } from './utils.js';
let searchArea = document.getElementById('search-wrapper')
var recipesList = []

searchArea.addEventListener('submit', async function(e){
    e.preventDefault()
    let searchTerm = searchArea.elements[0].value
    document.getElementById('message-display').classList.add('hidden')
    
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











