export function NoResultsDisplay(){
    return (
        <div className=""
        document.getElementById('results-list').innerHTML = ""
        document.getElementById('message-display').classList.remove('hidden')
        document.getElementById('message-display').innerHTML = `
            <p class='empty-state-message'> Unable to find what you're looking for. Please try another search.</p>
        `
    )
}