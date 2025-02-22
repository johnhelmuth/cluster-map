import MiniSearch, {type SearchResult} from "minisearch";

export type SearchResultsType = {
    results: SearchResult[],
    more: boolean,
};

export async function useContentSearch() {
    const {data} = await useAsyncData('search',
        () => queryCollectionSearchSections('content')
    );

    console.log('useContentSearch() data: ', data);
    const miniSearch = new MiniSearch({
        fields: ['title', 'content', 'description'],
        storeFields: ['title', 'content', 'description'],
        searchOptions: {
            prefix: true,
            fuzzy: 0.2,
        },
    });

    // Add data to the MiniSearch instance
    miniSearch.addAll(toValue(data.value || []));

    const getSearchResults = (searchQuery: string, maxReturned? : number): SearchResultsType => {
        const returnOnly = (maxReturned == null ? 0 : maxReturned);
        const result = miniSearch.search(
            toValue(searchQuery),
            {
                boost: {title: 2},
                combineWith: 'AND',
                fuzzy: (term) => term.length > 3 ? 0.2 : false,
            }
        );
        const returnValue = {
            results: [] as SearchResult[],
            more: false,
        }
        console.log('getSearchResults() result: ', result);
        if (returnOnly < 1) {
            returnValue.results = result;
            return returnValue;
        }
        returnValue.results = result.slice(0, returnOnly);
        returnValue.more = (result.length > returnOnly);
        return returnValue;
    }

    return reactive({getSearchResults});
}