"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { EMPTY_SETTLEMENT_FILTER } from "../constants";
import { getSettlements } from "../services/settlement.service";
import type { SettlementFilter, SettlementResponse } from "../types";

const DEFAULT_PAGE_SIZE = 20;

export function useSettlements() {
  const [items, setItems] = useState<SettlementResponse[]>([]);

  const [filter, setFilter] = useState<SettlementFilter>(
    EMPTY_SETTLEMENT_FILTER,
  );

  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (
      currentFilter: SettlementFilter,
      currentPage: number,
      currentPageSize: number,
    ) => {
      try {
        setLoading(true);

        const response = await getSettlements(
          currentFilter,
          currentPage,
          currentPageSize,
        );

        setItems(response.content);

        setTotalPages(response.page.totalPages);

        setTotalElements(response.page.totalElements);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as liquidações.";

        setItems([]);

        setTotalPages(0);

        setTotalElements(0);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        void load(filter, page, pageSize);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filter, page, pageSize, load]);

  const applyFilter = useCallback((newFilter: SettlementFilter) => {
    setPage(0);
    setFilter(newFilter);
  }, []);

  const clearFilter = useCallback(() => {
    setPage(0);
    setFilter(EMPTY_SETTLEMENT_FILTER);
  }, []);

  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  }, []);

  const reload = useCallback(() => {
    return load(filter, page, pageSize);
  }, [filter, page, pageSize, load]);

  return {
    items,
    filter,
    page,
    pageSize,
    totalPages,
    totalElements,
    loading,
    applyFilter,
    clearFilter,
    changePage,
    changePageSize,
    reload,
  };
}
