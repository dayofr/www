import {Post} from "./posts.data";

function filterPath(path: string, posts: Post[]) {
    return posts.filter(({url}) => url.includes(path));
}

export {filterPath}