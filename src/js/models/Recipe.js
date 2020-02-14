import axios from 'axios';

export default class Recipe{
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.ingredients = res.data.recipe.ingredients;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
        } catch (e) {
            console.log(e);
            alert(`Something went wrong \n${e}`);
        }
    }

    /**
     * Assume that 15 mins needed for 3 ingredients
     */
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings() {
        this.sevings = 4;

    }
}