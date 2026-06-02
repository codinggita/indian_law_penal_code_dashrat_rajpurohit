import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStart, fetchLawsSuccess, fetchFailure, setFilters, setPage } from '../store/lawSlice';
import API from '../services/api';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const LawsListing = () => {
  const dispatch = useDispatch();
  const { laws, pagination, filters, loading } = useSelector((state) => state.law);
  const [searchInput, setSearchInput] = useState(filters.search);

  const loadLaws = async () => {
    dispatch(fetchStart());
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page);
      queryParams.append('limit', pagination.limit);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.act) queryParams.append('act', filters.act);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.bailable) queryParams.append('bailable', filters.bailable);
      if (filters.cognizable) queryParams.append('cognizable', filters.cognizable);
      if (filters.sort) queryParams.append('sort', filters.sort);

      const response = await API.get(`/laws?${queryParams.toString()}`);
      dispatch(fetchLawsSuccess({
        data: response.data.data,
        pagination: response.data.pagination,
      }));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch penal laws.';
      dispatch(fetchFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    loadLaws();
  }, [pagination.page, filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  };

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
  };

  const headers = ['Section', 'Title', 'Act Name', 'Category', 'Bailable', 'Cognizable'];
  const columns = [
    'sectionNumber',
    'title',
    'actName',
    'category',
    (row) => (row.bailable ? '🟢 Bailable' : '🔴 Non-Bailable'),
    (row) => (row.cognizable ? '🟢 Cognizable' : '🔴 Non-Cognizable'),
  ];

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">
          ⚖️ Explore Indian Penal Statutes
        </h2>
        <p className="text-sm text-slate-400">Search, filter, and review dynamic MongoDB-linked statutes</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <Input
            name="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by keywords (e.g. Murder, Theft, Cybercrime)..."
            className="flex-1"
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={filters.act}
            onChange={(e) => handleFilterChange('act', e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="">All Acts</option>
            <option value="IPC">Indian Penal Code (IPC)</option>
            <option value="CrPC">Criminal Procedure Code (CrPC)</option>
            <option value="Evidence Act">Indian Evidence Act</option>
          </select>

          <select
            value={filters.bailable}
            onChange={(e) => handleFilterChange('bailable', e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="">Bailable Offense?</option>
            <option value="true">Bailable Only</option>
            <option value="false">Non-Bailable Only</option>
          </select>

          <select
            value={filters.cognizable}
            onChange={(e) => handleFilterChange('cognizable', e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="">Cognizable Offense?</option>
            <option value="true">Cognizable Only</option>
            <option value="false">Non-Cognizable Only</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="">Sort By</option>
            <option value="sectionNumber">Section Number (Asc)</option>
            <option value="-sectionNumber">Section Number (Desc)</option>
            <option value="-views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Table Display */}
      <Table
        headers={headers}
        data={laws}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPage(page))}
      />
    </div>
  );
};

export default LawsListing;
