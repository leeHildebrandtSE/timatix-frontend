// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for API calls with loading, error handling, and data management
 * @param {string} endpoint - API endpoint
 * @param {object} options - Configuration options
 * @returns {object} API state and methods
 */
export const useApi = (endpoint, options = {}) => {
  const {
    immediate = false,
    params = {},
    method = 'GET',
    onSuccess,
    onError,
    dependencies = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const makeRequest = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const finalParams = { ...params, ...customParams };
      let response;

      switch (method.toLowerCase()) {
        case 'get':
          response = await apiService.get(endpoint, finalParams);
          break;
        case 'post':
          response = await apiService.post(endpoint, finalParams);
          break;
        case 'put':
          response = await apiService.put(endpoint, finalParams);
          break;
        case 'patch':
          response = await apiService.patch(endpoint, finalParams);
          break;
        case 'delete':
          response = await apiService.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response);
      setLastFetched(new Date().toISOString());
      
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, params, onSuccess, onError]);

  const refetch = useCallback((customParams = {}) => {
    return makeRequest(customParams);
  }, [makeRequest]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setLastFetched(null);
  }, []);

  // Auto-fetch on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      makeRequest();
    }
  }, [immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    lastFetched,
    execute: makeRequest,
    refetch,
    reset,
    hasData: data !== null,
    hasError: error !== null,
  };
};

/**
 * Hook for paginated API calls
 * @param {string} endpoint - API endpoint
 * @param {object} options - Configuration options
 * @returns {object} Pagination state and methods
 */
export const usePaginatedApi = (endpoint, options = {}) => {
  const {
    pageSize = 20,
    initialPage = 1,
    onSuccess,
    onError,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [allData, setAllData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  const { data, loading, error, execute } = useApi(endpoint, {
    method: 'GET',
    onSuccess: (response) => {
      const items = response.data || response.items || [];
      const totalPages = response.totalPages || Math.ceil((response.total || 0) / pageSize);
      
      if (currentPage === 1) {
        setAllData(items);
      } else {
        setAllData(prev => [...prev, ...items]);
      }
      
      setHasNextPage(currentPage < totalPages);
      
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError,
  });

  const loadPage = useCallback((page) => {
    setCurrentPage(page);
    return execute({
      page,
      limit: pageSize,
    });
  }, [execute, pageSize]);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !loading) {
      return loadPage(currentPage + 1);
    }
  }, [loadPage, currentPage, hasNextPage, loading]);

  const refresh = useCallback(() => {
    setCurrentPage(initialPage);
    setAllData([]);
    setHasNextPage(true);
    return loadPage(initialPage);
  }, [loadPage, initialPage]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setAllData([]);
    setHasNextPage(true);
  }, [initialPage]);

  return {
    data: allData,
    loading,
    error,
    currentPage,
    hasNextPage,
    loadPage,
    loadNextPage,
    refresh,
    reset,
    totalItems: allData.length,
  };
};

/**
 * Hook for infinite scroll API calls
 * @param {string} endpoint - API endpoint
 * @param {object} options - Configuration options
 * @returns {object} Infinite scroll state and methods
 */
export const useInfiniteApi = (endpoint, options = {}) => {
  const {
    pageSize = 20,
    threshold = 0.8,
    onSuccess,
    onError,
  } = options;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, execute } = useApi(endpoint, {
    method: 'GET',
    onSuccess: (response) => {
      const newItems = response.data || response.items || [];
      const total = response.total || 0;
      
      if (refreshing || page === 1) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      
      setHasMore(items.length + newItems.length < total);
      setRefreshing(false);
      
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError: (err) => {
      setRefreshing(false);
      if (onError) {
        onError(err);
      }
    },
  });

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
      return execute({
        page: page + 1,
        limit: pageSize,
      });
    }
  }, [hasMore, loading, page, pageSize, execute]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    return execute({
      page: 1,
      limit: pageSize,
    });
  }, [execute, pageSize]);

  const shouldLoadMore = useCallback((scrollY, contentHeight, layoutHeight) => {
    const scrollPercentage = scrollY / (contentHeight - layoutHeight);
    return scrollPercentage >= threshold && hasMore && !loading;
  }, [threshold, hasMore, loading]);

  return {
    data: items,
    loading,
    error,
    hasMore,
    refreshing,
    loadMore,
    refresh,
    shouldLoadMore,
    totalItems: items.length,
  };
};

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint
 * @param {object} options - Configuration options
 * @returns {object} Mutation state and methods
 */
export const useMutation = (endpoint, options = {}) => {
  const {
    method = 'POST',
    onSuccess,
    onError,
    onSettled,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (variables = {}) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (method.toLowerCase()) {
        case 'post':
          response = await apiService.post(endpoint, variables);
          break;
        case 'put':
          response = await apiService.put(endpoint, variables);
          break;
        case 'patch':
          response = await apiService.patch(endpoint, variables);
          break;
        case 'delete':
          response = await apiService.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported mutation method: ${method}`);
      }

      setData(response);
      
      if (onSuccess) {
        onSuccess(response, variables);
      }

      return response;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err, variables);
      }
      
      throw err;
    } finally {
      setLoading(false);
      
      if (onSettled) {
        onSettled();
      }
    }
  }, [endpoint, method, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    loading,
    error,
    data,
    reset,
    isIdle: !loading && !error && !data,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null,
  };
};

export default {
  useApi,
  usePaginatedApi,
  useInfiniteApi,
  useMutation,
};