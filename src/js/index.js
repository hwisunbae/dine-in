import Search from './models/Search';
import { elements} from "./views/base";
import * as searchView from './views/searchView';


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
    const query = searchView.getInput();
    console.log(query);


    if (query) {
        state.search = new Search(query);

        await state.search.getResults();
        console.log(state.search.result);
    }
};

elements.searchForm.addEventListener('submit' ,e => {
    e.preventDefault();
    controlSearch();

});

