import Search from './models/Search';

/** Global state of the app
 *  - search object
 *  - current recipe object
 *  - shopping list object
 *  - liked recipes
 */
const state = {};

/**
 * 1. get query from view
 * 2. new search object and add to state
 * 3. prepare UI for results
 * 4. search for recipes
 * 5. render results on UI
 */
const controlSearch = async () => {
    const query = 'pizza';

    if (query) {
        state.search = new Search(query);

        await state.search.getResults();
        console.log(state.search.result);
    }
};

document.querySelector('.search').addEventListener('submit' ,e => {
    e.preventDefault();
    controlSearch();

});

