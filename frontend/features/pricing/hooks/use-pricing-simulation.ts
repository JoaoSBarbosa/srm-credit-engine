"use client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  pricingSimulationSchema,
  type PricingSimulationFormData,
  type OperationFormData,
} from "../schema";

import { calculatePricing, simulatePricing } from "../services/pricing.service";

import { createReceivable } from "@/features/receivables/services/receivable.service";
import { getCurrencies } from "@/features/currencies/services/currency.service";
import { getReceivableTypes } from "@/features/receivable-types/services/receivable-type.service";

import type { CurrencyOption } from "@/features/currencies/types";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";
import type { PricingSimulationResponse } from "../types";

export function usePricingSimulation() {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [receivableTypes, setReceivableTypes] = useState<
    ReceivableTypeOption[]
  >([]);

  const [simulation, setSimulation] =
    useState<PricingSimulationResponse | null>(null);

  const [showOperationForm, setShowOperationForm] = useState(false);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [loadingOperation, setLoadingOperation] = useState(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<PricingSimulationFormData>({
    resolver: zodResolver(pricingSimulationSchema),
    mode: "onChange",
    defaultValues: {
      faceValue: "",
      receivableTypeId: "",
      operationDate: "",
      dueDate: "",
      baseRate: "",
      titleCurrencyId: "",
      paymentCurrencyId: "",
    },
  });

  const formData = useWatch({
    control: form.control,
  });

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);
        setApiError(null);

        const [currencyResponse, receivableTypeResponse] = await Promise.all([
          getCurrencies(),
          getReceivableTypes(),
        ]);

        setCurrencies(currencyResponse.content);
        setReceivableTypes(receivableTypeResponse.content);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados.";

        setApiError(message);
        toast.error(message);
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  useEffect(() => {
    if (loadingOptions) {
      return;
    }

    const result = pricingSimulationSchema.safeParse(formData);

    if (!result.success) {
      const timeout = window.setTimeout(() => {
        setSimulation(null);
        setShowOperationForm(false);
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingSimulation(true);
        setApiError(null);

        const response = await simulatePricing(result.data);

        setSimulation(response);
        setShowOperationForm(false);

        toast.success("Simulação realizada com sucesso.");
      } catch (error) {
        setSimulation(null);

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível realizar a simulação.";

        setApiError(message);
        toast.error(message);
      } finally {
        setLoadingSimulation(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, loadingOptions]);

  async function handleOperation(data: OperationFormData) {
    const result = pricingSimulationSchema.safeParse(formData);

    if (!result.success) {
      toast.error("Corrija os dados da simulação antes de continuar.");
      return;
    }

    try {
      setLoadingOperation(true);
      setApiError(null);

      const simulationData = result.data;

      const receivable = await createReceivable({
        assignorName: data.assignorName,
        assignorDocument: data.assignorDocument,
        receivableTypeId: simulationData.receivableTypeId,
        currencyId: simulationData.titleCurrencyId,
        faceValue: simulationData.faceValue,
        dueDate: simulationData.dueDate,
        operationDate: simulationData.operationDate,
        baseRate: simulationData.baseRate,
      });

      await calculatePricing(receivable.id, {
        paymentCurrencyId: simulationData.paymentCurrencyId,
      });
      setShowOperationForm(false);

      toast.success("Operação realizada com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível realizar a operação.";

      setApiError(message);
      toast.error(message);
    } finally {
      setLoadingOperation(false);
    }
  }

  function openOperationForm() {
    setShowOperationForm(true);
  }

  function closeOperationForm() {
    setShowOperationForm(false);
  }

  return {
    form,
    formData,
    currencies,
    receivableTypes,
    simulation,
    showOperationForm,
    openOperationForm,
    closeOperationForm,
    loadingOptions,
    loadingSimulation,
    loadingOperation,
    apiError,
    handleOperation,
  };
}
