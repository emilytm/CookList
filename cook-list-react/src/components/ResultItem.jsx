
export function ResultItem(props){

    return (
        
    )

};

export default ResultItem


/*
function renderResults(recipeArray) {
    console.log('----------------------------------------------------------------')
    let interactionIcon = '/add.svg'
    let interactionText = 'My Recipes'
    let interactionAlt = 'Add icon for Add to My Recipes button'
    if(recipeArray.length >= 1){  
        document.getElementById('message-display').classList.add('hidden')
        let resultsHtml = ""
        for ( let recipe of recipeArray ) {
            console.log(`GOING TO RENDER RECIPE WITH NAME ${recipe.name} AND UNIQUEURI ${recipe.uniqueUri}`)
            let imageLink = recipe.image
            
            //Format the array of ingredients as a comma separated string
            let ingredients = []
            recipe.ingredients.forEach(food => {
                ingredients.push(food.text)
            })
            let ingredientString = ingredients.join(", ")


            
            if (localStorage.getItem('myRecipesList')){
                if (isAlreadySaved(recipe.uniqueUri)){
                    console.log(`${recipe.name} is in the list already`)
                    interactionIcon = '/remove.svg'
                    interactionText = 'Remove'
                    interactionAlt = 'Remove icon for Remove from My Recipes button'                    
                }
            }
            console.log(`for ${recipe.name} the interactions are: `)    
            console.log(interactionIcon, interactionAlt, interactionText)
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

*/