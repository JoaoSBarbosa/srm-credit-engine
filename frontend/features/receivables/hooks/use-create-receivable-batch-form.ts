"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import type { CurrencyResponse } from "@/features/currencies/types";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";
import { getCurrencies } from "@/features/currencies/services/currency.service";
import { getReceivableTypes } from "@/features/receivable-types/services/receivable-type.service";
import { createReceivableBatch } from "../services/receivable.service";
import type { BatchReceivableItem, CreateReceivablePayload } from "../types";
import { normalizeDocument } from "@/utils/formatters";

const MAX_RECEIVABLES = 20;
const MAX_EXPANDED = 1;

function createInitialReceivable(): CreateReceivablePayload {
  return {
    assignorName: "",
    assignorDocument: "",
    receivableTypeId: "",
    currencyId: "",
    faceValue: "100000",
    dueDate: "2026-12-31",
    operationDate: "2026-08-08",
    baseRate: "0.015",
  };
}

function createItem(key: string, expanded = true): BatchReceivableItem {
  return {
    key,
    data: createInitialReceivable(),
    expanded,
  };
}

export function useCreateReceivableBatch() {
  const nextKey = useRef(1);

  const [items, setItems] = useState<BatchReceivableItem[]>([
    createItem("receivable-0", true),
  ]);

  const [types, setTypes] = useState<ReceivableTypeOption[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyResponse[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [typesResponse, currenciesResponse] = await Promise.all([
          getReceivableTypes(),
          getCurrencies(),
        ]);

        setTypes(typesResponse.content ?? []);
        setCurrencies(currenciesResponse.content ?? []);
      } catch {
        setTypes([]);
        setCurrencies([]);
        setError("Não foi possível carregar as opções do formulário.");
      }
    }

    void loadOptions();
  }, []);

  const updateReceivable = useCallback(
    (
      receivableKey: string,
      field: keyof CreateReceivablePayload,
      value: string,
    ) => {
      setItems((current) =>
        current.map((item) =>
          item.key === receivableKey
            ? {
                ...item,
                data: {
                  ...item.data,
                  [field]: value,
                },
              }
            : item,
        ),
      );
    },
    [],
  );

  const addReceivable = useCallback(() => {
    setItems((current) => {
      if (current.length >= MAX_RECEIVABLES) {
        toast.error(`O lote não pode exceder ${MAX_RECEIVABLES} recebíveis.`);
        return current;
      }

      const expandedCount = current.filter((item) => item.expanded).length;

      const key = `receivable-${nextKey.current++}`;

      return [
        ...current.map((item) => ({
          ...item,
          expanded: expandedCount < MAX_EXPANDED ? item.expanded : false,
        })),
        createItem(key, true),
      ];
    });

    setMessage(null);
    setError(null);
  }, []);

  const toggleExpanded = useCallback((key: string) => {
    setItems((current) => {
      const target = current.find((item) => item.key === key);

      if (!target) {
        return current;
      }

      if (target.expanded) {
        return current.map((item) =>
          item.key === key
            ? {
                ...item,
                expanded: false,
              }
            : item,
        );
      }

      const expandedCount = current.filter((item) => item.expanded).length;

      if (expandedCount >= MAX_EXPANDED) {
        return current;
      }

      return current.map((item) =>
        item.key === key
          ? {
              ...item,
              expanded: true,
            }
          : item,
      );
    });
  }, []);

  const removeReceivable = useCallback((key: string) => {
    setItems((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((item) => item.key !== key);
    });

    setSelectedKeys((current) =>
      current.filter((selectedKey) => selectedKey !== key),
    );
  }, []);

  const toggleSelected = useCallback((key: string) => {
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedKeys((current) =>
      current.length === items.length ? [] : items.map((item) => item.key),
    );
  }, [items]);

  const removeSelected = useCallback(() => {
    if (selectedKeys.length === 0) {
      return;
    }

    if (selectedKeys.length === items.length) {
      setItems([createItem(`receivable-${nextKey.current++}`, true)]);

      setSelectedKeys([]);
      return;
    }

    setItems((current) =>
      current.filter((item) => !selectedKeys.includes(item.key)),
    );

    setSelectedKeys([]);
  }, [items.length, selectedKeys]);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setLoading(true);
      setMessage(null);
      setError(null);

      try {
        await createReceivableBatch({
          receivables: items.map((item) => ({
            ...item.data,
            assignorDocument: normalizeDocument(item.data.assignorDocument),
          })),
        });

        const count = items.length;

        setItems([createItem(`receivable-${nextKey.current++}`, true)]);

        setSelectedKeys([]);

        const successMessage =
          count === 1
            ? "Recebível cadastrado com sucesso."
            : `${count} recebíveis cadastrados com sucesso.`;

        setMessage(successMessage);
        toast.success(successMessage);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Não foi possível cadastrar o lote de recebíveis.";

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [items],
  );

  return {
    items,
    types,
    currencies,
    selectedKeys,
    loading,
    message,
    error,
    updateReceivable,
    addReceivable,
    toggleExpanded,
    removeReceivable,
    toggleSelected,
    toggleSelectAll,
    removeSelected,
    handleSubmit,
  };
}
