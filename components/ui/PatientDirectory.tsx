"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, X, RefreshCw, Moon, Sun } from 'lucide-react';
import CardView from './CardView';
import TableView from './TableView';

interface PatientContact {
    address: string | null;
    number: string | null;
    email: string | null;
}

export interface Patient {
    patient_id: number;
    patient_name: string;
    age: number;
    photo_url: string | null;
    contact: PatientContact[];
    medical_issue: string;
}

interface FilterOption {
    label: string;
    value: string;
    active: boolean;
}

interface SortOption {
    field: keyof Patient;
    direction: 'asc' | 'desc';
    label: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

interface ApiResponse {
    data: Patient[];
    pagination: PaginationData;
}

const PatientDirectory: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'table' | 'card'>('card');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [showFilters, setShowFilters] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [totalPatients, setTotalPatients] = useState(0);
    const [darkMode, setDarkMode] = useState(false);

    // Filter states - medical issues from your data
    const [filters, setFilters] = useState<FilterOption[]>([
        { label: 'Fever', value: 'fever', active: true },
        { label: 'Headache', value: 'headache', active: true },
        { label: 'Sore Throat', value: 'sore throat', active: true },
        { label: 'Sprained Ankle', value: 'sprained ankle', active: true },
        { label: 'Rash', value: 'rash', active: true },
        { label: 'Ear Infection', value: 'ear infection', active: true },
        { label: 'Stomach Ache', value: 'stomach ache', active: true },
        { label: 'Allergic Reaction', value: 'allergic reaction', active: true }
    ]);

    // Sort states
    const [sortOptions] = useState<SortOption[]>([
        { field: 'patient_name', direction: 'asc', label: 'Name A-Z' },
        { field: 'patient_name', direction: 'desc', label: 'Name Z-A' },
        { field: 'age', direction: 'asc', label: 'Age (Youngest)' },
        { field: 'age', direction: 'desc', label: 'Age (Oldest)' },
        { field: 'patient_id', direction: 'asc', label: 'ID (Low to High)' },
        { field: 'patient_id', direction: 'desc', label: 'ID (High to Low)' },
    ]);

    const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]);

    // Apply dark mode class to body
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page when search changes
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Build query parameters for API call
    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();
        
        params.set('page', currentPage.toString());
        params.set('limit', itemsPerPage.toString());
        
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        }
        
        params.set('sortBy', activeSort.field);
        params.set('sortOrder', activeSort.direction);
        
        // Add medical issue filters
        const activeFilterValues = filters.filter(f => f.active).map(f => f.value);
        if (activeFilterValues.length > 0 && activeFilterValues.length < filters.length) {
            params.set('medicalIssue', activeFilterValues.join(','));
        }
        
        return params.toString();
    }, [currentPage, itemsPerPage, debouncedSearch, activeSort, filters]);

    // Fetch data effect
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const queryString = buildQueryParams();
                const response = await fetch(`/api/data?${queryString}`);
                console.log('API Response:', response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data: ApiResponse = await response.json();
                console.log('Fetched Patients Data:', data);
                setPatients(data.data);
                setPagination(data.pagination);
                
                // Update total patients count for first load
                if (currentPage === 1 && !debouncedSearch && filters.every(f => f.active)) {
                    setTotalPatients(data.pagination.totalItems);
                }
                
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to fetch patients data. Please try again.');
                setPatients([]);
                setPagination(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [buildQueryParams]);

    // Handle filter toggle
    const toggleFilter = (value: string) => {
        setFilters(prev => prev.map(filter =>
            filter.value === value
                ? { ...filter, active: !filter.active }
                : filter
        ));
        setCurrentPage(1);
    };

    // Remove filter
    const removeFilter = (value: string) => {
        setFilters(prev => prev.map(filter =>
            filter.value === value
                ? { ...filter, active: false }
                : filter
        ));
        setCurrentPage(1);
    };

    // Get active filters count
    const activeFiltersCount = filters.filter(f => f.active).length;

    // Handle sort change
    const handleSortChange = (option: SortOption) => {
        setActiveSort(option);
        setCurrentPage(1);
        setShowSortMenu(false);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Retry function
    const retryFetch = () => {
        setError(null);
        window.location.reload();
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 dark:bg-gray-900 dark:text-white min-h-screen">
                <div className="animate-pulse">
                    <div className="h-24 bg-blue-500 dark:bg-blue-700 rounded-lg mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={`skeleton-${i}`} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 dark:bg-gray-900 dark:text-white min-h-screen">
                <div className="text-center py-12">
                    <div className="text-red-500 text-lg font-medium mb-2">Error</div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={retryFetch}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 px-4 lg:px-6 py-8">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={`cross-${i}`}
                            className="absolute text-white text-2xl"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                transform: 'rotate(45deg)',
                            }}
                        >
                            +
                        </div>
                    ))}
                </div>
                <div className="relative flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Patient Directory</h1>
                        <p className="text-blue-100 dark:text-blue-200 mt-1">
                            {pagination ? (
                                `${pagination.totalItems} of ${totalPatients} patients ${debouncedSearch || activeFiltersCount < filters.length ? 'found' : ''}`
                            ) : (
                                'Loading patient data...'
                            )}
                        </p>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <Sun className="h-5 w-5 text-white" />
                        ) : (
                            <Moon className="h-5 w-5 text-white" />
                        )}
                    </button>
                </div>
            </div>

            <div className="px-4 lg:px-6 py-6">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        onClick={() => setActiveView('table')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeView === 'table'
                                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Table View
                    </button>
                    <button
                        onClick={() => setActiveView('card')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeView === 'card'
                                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Card View
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Filter className="h-4 w-4" />
                            Active Filters: {activeFiltersCount}
                        </div>
                    </div>
                </div>

                {/* Search, Sort and Filter Controls */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search patients, ID, phone, email, or medical issue..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                showFilters ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowSortMenu(!showSortMenu)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:bg-gray-800 dark:text-white"
                            >
                                Sort: {activeSort.label}
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {showSortMenu && (
                                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[200px]">
                                    {sortOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSortChange(option)}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white ${
                                                activeSort === option ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                            } ${index === 0 ? 'rounded-t-lg' : ''} ${
                                                index === sortOptions.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100 dark:border-gray-700'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Filter by Medical Issue</h3>
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => toggleFilter(filter.value)}
                                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                        filter.active
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Filter Tags */}
                {activeFiltersCount < filters.length && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {filters.filter(f => f.active).map((filter) => (
                            <span
                                key={filter.value}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                            >
                                {filter.label}
                                <button
                                    onClick={() => removeFilter(filter.value)}
                                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Content based on active view */}
                {activeView === 'card' ? (
                    <CardView 
                        patients={patients} 
                        getMedicalIssueBadge={getMedicalIssueBadge}
                        getInitials={getInitials}
                    />
                ) : (
                    <TableView 
                        patients={patients} 
                        getMedicalIssueBadge={getMedicalIssueBadge}
                        getInitials={getInitials}
                    />
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-800 dark:text-white"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {(() => {
                                    const { currentPage, totalPages } = pagination;
                                    const pages = [];
                                    const maxVisible = 5;
                                    
                                    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                    let end = Math.min(totalPages, start + maxVisible - 1);
                                    
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }

                                    for (let i = start; i <= end; i++) {
                                        pages.push(
                                            <button
                                                key={`page-${i}`}
                                                onClick={() => handlePageChange(i)}
                                                className={`w-8 h-8 text-sm border rounded transition-colors dark:bg-gray-800 dark:text-white ${
                                                    currentPage === i
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    
                                    return pages;
                                })()}
                            </div>

                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-800 dark:text-white"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {patients.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 text-lg font-medium mb-2">No patients found</div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {debouncedSearch 
                                ? `No results for "${debouncedSearch}"` 
                                : "No patients match the selected filters"}
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setDebouncedSearch('');
                                setFilters(prev => prev.map(f => ({ ...f, active: true })));
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:bg-gray-800 dark:text-white"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* End of results indicator for last page */}
                {!loading && patients.length > 0 && pagination && pagination.currentPage === pagination.totalPages && pagination.totalPages > 1 && (
                    <div className="text-center py-8">
                        <div className="text-gray-400 dark:text-gray-500 text-sm">
                            End of results - {pagination.totalItems} total patients
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper functions
const getMedicalIssueBadge = (issue: string) => {
    const badgeMap: Record<string, string> = {
        'fever': 'bg-red-200 text-red-900 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-800',
        'headache': 'bg-orange-200 text-orange-900 border-orange-300 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800',
        'sore throat': 'bg-yellow-200 text-yellow-900 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800',
        'sprained ankle': 'bg-green-200 text-green-900 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-800',
        'rash': 'bg-pink-200 text-pink-900 border-pink-300 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800',
        'ear infection': 'bg-cyan-200 text-cyan-900 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-200 dark:border-cyan-800',
        'sinusitis': 'bg-purple-200 text-purple-900 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800',
        'stomach ache': 'bg-teal-200 text-teal-900 border-teal-300 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-800',
        'allergic reaction': 'bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800',
    };
    return badgeMap[issue.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
};

const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();
};

export default PatientDirectory;