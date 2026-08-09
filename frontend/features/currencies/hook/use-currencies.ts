"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createCurrency,
  getCurrencies,
  updateCurrency,
} from "../services/currency.service";

import type { CurrencyRequest, CurrencyResponse } from "../types";

export function useCurrencies() {
  const [items, setItems] = useState<CurrencyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingCurrency, setEditingCurrency] =
    useState<CurrencyResponse | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCurrencies();

      setItems(response.content ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as moedas.";

      toast.error(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        void load();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [load]);

  const openCreateModal = useCallback(() => {
    setEditingCurrency(null);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((currency: CurrencyResponse) => {
    setEditingCurrency(currency);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingCurrency(null);
  }, [saving]);

  const save = useCallback(
    async (payload: CurrencyRequest) => {
      try {
        setSaving(true);

        if (editingCurrency) {
          await updateCurrency(editingCurrency.id, payload);

          toast.success("Moeda atualizada com sucesso.");
        } else {
          await createCurrency(payload);

          toast.success("Moeda cadastrada com sucesso.");
        }

        setModalOpen(false);
        setEditingCurrency(null);

        await load();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível salvar a moeda.";

        toast.error(message);
      } finally {
        setSaving(false);
      }
    },
    [editingCurrency, load],
  );

  return {
    items,
    loading,
    saving,
    modalOpen,
    editingCurrency,
    load,
    openCreateModal,
    openEditModal,
    closeModal,
    save,
  };
}
