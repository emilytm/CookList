
export function Header(props){
    console.log(props);
    let myRecipesclassName = props.currentPage === 'myrecipes' ? 'active' : 'inactive'
    let homeClassName = !myRecipesclassName
    return (
        <header>
            <div className="header-text-wrapper">
                <h1><a href="#" className={homeClassName}>Find Recipes</a></h1>
                <h4><a href="/myrecipes.html" className={myRecipesclassName}>My Recipes</a></h4>
            </div>
            <form className="search-wrapper" id="search-wrapper">
                <input className="search-box" name="search-box" id="search-box" type="text" placeholder="Search for a recipe" />
                <button className="search-button" name="search-button" id="search-button">Search</button>
            </form>
        </header>
    )
};

export default Header;