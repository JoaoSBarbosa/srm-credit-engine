"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  pricingSimulationSchema,
  type PricingSimulationFormData,
} from "../schema";

import { simulatePricing } from "../services/pricing.service";

import { getCurrencies } from "@/features/currencies/services/currency.service";
import { getReceivableTypes } from "@/features/receivable-types/services/receivable-type.service";

import type { CurrencyOption } from "@/features/currencies/types";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";
import type { PricingSimulationResponse } from "../types";

import { SimulationResult } from "./simulation-result";
import { FormField } from "@/shared/components/fields/form-field";
import { SelectField } from "@/shared/components/fields/select-field";
import { CurrencyInput } from "@/shared/components/inputs/currency-input";
import { PercentageInput } from "@/shared/components/inputs/percentage-input";

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-slate-400";

export function PricingSimulationForm() {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [receivableTypes, setReceivableTypes] = useState<
    ReceivableTypeOption[]
  >([]);

  const [simulation, setSimulation] =
    useState<PricingSimulationResponse | null>(null);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<PricingSimulationFormData>({
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
    control,
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

    const timer = setTimeout(async () => {
      const result = pricingSimulationSchema.safeParse(formData);

      if (!result.success) {
        setSimulation(null);
        return;
      }

      try {
        setLoadingSimulation(true);
        setApiError(null);
        const response = await simulatePricing(result.data);
        setSimulation(response);
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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">
            Simulação de precificação
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Informe os dados do recebível para calcular o valor presente.
          </p>
        </div>

        {apiError && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {apiError}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="faceValue"
            label="Valor de face"
            error={errors.faceValue?.message}
          >
            <CurrencyInput
              id="faceValue"
              placeholder="100000,00"
              value={formData.faceValue ?? ""}
              onChange={(value) => {
                const event = {
                  target: {
                    name: "faceValue",
                    value,
                  },
                } as never;
                register("faceValue").onChange(event);
              }}
              className={inputClassName}
            />
          </FormField>
          <FormField
            id="baseRate"
            label="Taxa base (%)"
            error={errors.baseRate?.message}
          >
            <Controller
              name="baseRate"
              control={control}
              render={({ field }) => (
                <PercentageInput
                  id="baseRate"
                  placeholder="0,01"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  className={inputClassName}
                />
              )}
            />
          </FormField>

          <SelectField
            id="receivableTypeId"
            label="Tipo de recebível"
            loading={loadingOptions}
            disabled={loadingOptions}
            error={errors.receivableTypeId?.message}
            registration={register("receivableTypeId")}
            options={receivableTypes.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
          />

          <SelectField
            id="titleCurrencyId"
            label="Moeda do título"
            loading={loadingOptions}
            disabled={loadingOptions}
            error={errors.titleCurrencyId?.message}
            registration={register("titleCurrencyId")}
            options={currencies.map((currency) => ({
              value: currency.id,
              label: `${currency.isoCode} - ${currency.name}`,
            }))}
          />

          <SelectField
            id="paymentCurrencyId"
            label="Moeda de pagamento"
            loading={loadingOptions}
            disabled={loadingOptions}
            error={errors.paymentCurrencyId?.message}
            registration={register("paymentCurrencyId")}
            options={currencies.map((currency) => ({
              value: currency.id,
              label: `${currency.isoCode} - ${currency.name}`,
            }))}
          />

          <FormField
            id="operationDate"
            label="Data da operação"
            error={errors.operationDate?.message}
          >
            <input
              id="operationDate"
              type="date"
              {...register("operationDate")}
              className={inputClassName}
            />
          </FormField>

          <FormField
            id="dueDate"
            label="Data de vencimento"
            error={errors.dueDate?.message}
          >
            <input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className={inputClassName}
            />
          </FormField>
        </div>

        {loadingSimulation && (
          <p className="mt-4 text-sm text-slate-400">
            Atualizando simulação...
          </p>
        )}
      </form>

      <SimulationResult simulation={simulation} />
    </div>
  );
}
