import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { simulatePricing } from "@/features/pricing/services/pricing.service";
import type { PricingSimulationResponse } from "@/features/pricing/types";
import { getCurrencies } from "@/features/currencies/services/currency.service";
import type { CurrencyResponse } from "@/features/currencies/types";
import { getReceivableTypes } from "@/features/receivable-types/services/receivable-type.service";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";

import { createReceivable } from "../services/receivable.service";
import type { CreateReceivablePayload } from "../types";
import { toast } from "sonner";

export function createInitialForm(): CreateReceivablePayload {
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

export function useCreateReceivableForm() {
  const [form, setForm] = useState<CreateReceivablePayload>(createInitialForm);
  const [types, setTypes] = useState<ReceivableTypeOption[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyResponse[]>([]);
  const [preview, setPreview] = useState<PricingSimulationResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      }
    }

    void loadOptions();
  }, []);

  useEffect(() => {
    const hasRequiredValues = Boolean(
      form.receivableTypeId &&
      form.currencyId &&
      form.faceValue &&
      form.baseRate,
    );

    if (!hasRequiredValues) {
      const timeout = window.setTimeout(() => {
        setPreview(null);
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    let isCancelled = false;

    async function runSimulation() {
      try {
        const response = await simulatePricing({
          faceValue: form.faceValue,
          receivableTypeId: form.receivableTypeId,
          operationDate: form.operationDate,
          dueDate: form.dueDate,
          baseRate: form.baseRate,
          titleCurrencyId: form.currencyId,
          paymentCurrencyId: form.currencyId,
        });

        if (!isCancelled) {
          setPreview(response);
        }
      } catch {
        if (!isCancelled) {
          setPreview(null);
        }
      }
    }

    void runSimulation();

    return () => {
      isCancelled = true;
    };
  }, [form]);

  const updateField = useCallback(
    (field: keyof CreateReceivablePayload, value: string) => {
      setForm((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setForm(createInitialForm());
  }, []);

  const selectedType = useMemo(
    () => types.find((item) => item.id === form.receivableTypeId) ?? null,
    [form.receivableTypeId, types],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setMessage(null);

      try {
        await createReceivable(form);
        setMessage(
          "O recebível foi registrado e está disponível para consulta.",
        );
        toast.success("Recebível criado com sucesso.");
        resetForm();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Não foi possível criar o recebível.";

        toast.error(errorMessage);
        setMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [form, resetForm],
  );

  return {
    form,
    types,
    currencies,
    preview,
    selectedType,
    loading,
    message,
    updateField,
    handleSubmit,
  };
}
