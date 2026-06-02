import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  laws: [],
  currentLaw: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    act: '',
    category: '',
    state: '',
    bailable: '',
    cognizable: '',
    search: '',
    sort: '',
  },
  loading: false,
  error: null,
};

const lawSlice = createSlice({
  name: 'law',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLawsSuccess: (state, action) => {
      state.loading = false;
      state.laws = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchLawSuccess: (state, action) => {
      state.loading = false;
      state.currentLaw = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 on filter update
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
});

export const {
  fetchStart,
  fetchLawsSuccess,
  fetchLawSuccess,
  fetchFailure,
  setFilters,
  clearFilters,
  setPage,
} = lawSlice.actions;
export default lawSlice.reducer;
