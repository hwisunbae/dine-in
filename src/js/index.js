import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {clearLoader, elements, renderLoader} from "./views/base";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


/** Global state of the app
 *  - search object
 *  - current recipe object
 *  - shopping list object
 *  - liked recipes
 */
const state = {};
window.st = state;
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
            // console.log(state.recipe);
        } catch (e) {
            console.log(e);
            //TODO: HTML can be implemented
            alert('Error processing Recipe');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/* ----------------------
       LIST CONTROL
-------------------------*/
const controlList = () => {
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        window.items = item;
        // listView.renderItem(item);
    });
    for (const item of items) {
        listView.renderItem(item);
    }
};

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }

})

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

/* ----------------------
       LIKE CONTROL
-------------------------*/
// TODO : TESTING
state.likes = new Likes();
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(
            state.recipe.id,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );
        likesView.toggleLikeBtn(true);

    } else {
        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
    }
    console.log(state.likes);
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}