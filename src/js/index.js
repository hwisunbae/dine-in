import Search from './models/Search';
import Recipe from './models/Recipe';
import {clearLoader, elements, renderLoader} from "./views/base";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';


/** Global state of the app
 *  - search object
 *  - current recipe object
 *  - shopping list object
 *  - liked recipes
 */
const state = {};

/* ----------------------
       SEARCH CONTROL
-------------------------*/

/**
 * 1. get query from view
 * 2. new search object and add to state
 * 3. prepare UI for results
 * 4. search for recipes
 * 5. render results on UI
 */
const controlSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResult();

        renderLoader(elements.searchRes);

        try{
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something went with the search ...')
            clearLoader();
        }

    }
};

elements.searchForm.addEventListener('submit' ,e => {
    e.preventDefault();
    controlSearch();
});

// window.addEventListener('load' ,e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/* ----------------------
       RECIPE CONTROL
-------------------------*/

/**
 * Get ID from URL
 * UI for changes
 * create new recipe object
 * get recipe data
 * calculate servings and time
 * render Recipe
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if (state.search) {
            searchView.highlightSelected(id);
        }
        state.recipe = new Recipe(id);
        // window.r = state.recipe;

        try{
            await state.recipe.getRecipe();
            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            state.recipe.calcTime();
            state.recipe.calcServings();

            clearLoader();
            recipeView.renderRecipe(state.recipe);
            console.log(state.recipe);
        } catch (e) {
            //TODO: HTML can be implemented
            alert('Error processing Recipe');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
