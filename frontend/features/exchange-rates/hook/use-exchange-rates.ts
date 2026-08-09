"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getExchangeRates,
  createExchangeRate,
  updateExchangeRate,
  syncExchangeRate,
} from "../service/exchange-rate.service";
import {
  ExchangeRateResponse,
  CreateExchangeRateRequest,
  UpdateExchangeRateRequest,
} from "../type";

const DEFAULT_PAGE_SIZE = 20;

export function useExchangeRates() {
  const [items, setItems] = useState<ExchangeRateResponse[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (currentPage: number, currentPageSize: number) => {
      try {
        setLoading(true);
        const response = await getExchangeRates(currentPage, currentPageSize);
        setItems(response.content);
        setTotalPages(response.page.totalPages);
        setTotalElements(response.page.totalElements);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as taxas de câmbio.";

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
        void load(page, pageSize);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [load, page, pageSize]);

  const create = useCallback(
    async (payload: CreateExchangeRateRequest) => {
      try {
        setSaving(true);
        await createExchangeRate(payload);
        toast.success("Taxa de câmbio cadastrada com sucesso.");
        await load(page, pageSize);
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível cadastrar a taxa de câmbio.";

        toast.error(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [load, page, pageSize],
  );

  const update = useCallback(
    async (id: string, payload: UpdateExchangeRateRequest) => {
      try {
        setSaving(true);
        await updateExchangeRate(id, payload);
        toast.success("Taxa de câmbio atualizada com sucesso.");
        await load(page, pageSize);
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a taxa de câmbio.";

        toast.error(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [load, page, pageSize],
  );

  const sync = useCallback(
    async (sourceCurrencyId: string, targetCurrencyId: string) => {
      try {
        setSaving(true);

        await syncExchangeRate({
          sourceCurrencyId,
          targetCurrencyId,
        });

        toast.success("Taxa de câmbio sincronizada com sucesso.");

        await load(page, pageSize);

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível sincronizar a taxa de câmbio.";

        toast.error(message);

        return false;
      } finally {
        setSaving(false);
      }
    },
    [load, page, pageSize],
  );

  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  }, []);

  const reload = useCallback(() => {
    return load(page, pageSize);
  }, [load, page, pageSize]);

  return {
    items,
    page,
    pageSize,
    totalPages,
    totalElements,
    loading,
    saving,
    create,
    update,
    sync,
    changePage,
    changePageSize,
    reload,
  };
}
