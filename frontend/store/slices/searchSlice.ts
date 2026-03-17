import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
    query: string;
    results: any[];
    suggestions: string[];
    loading: boolean;
    recentSearches: string[];
}

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        results: [],
        suggestions: [],
        loading: false,
        recentSearches: [],
    } as SearchState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
        setResults: (state, action: PayloadAction<any[]>) => {
            state.results = action.payload;
            state.loading = false;
        },
        setSuggestions: (state, action: PayloadAction<string[]>) => {
            state.suggestions = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        addRecentSearch: (state, action: PayloadAction<string>) => {
            const searches = state.recentSearches.filter((s) => s !== action.payload);
            state.recentSearches = [action.payload, ...searches].slice(0, 8);
        },
        clearSearch: (state) => {
            state.query = '';
            state.results = [];
            state.suggestions = [];
        },
    },
});

export const { setQuery, setResults, setSuggestions, setLoading, addRecentSearch, clearSearch } =
    searchSlice.actions;
export default searchSlice.reducer;
