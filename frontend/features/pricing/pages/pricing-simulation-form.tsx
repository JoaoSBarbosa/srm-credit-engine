"use client";

import { Controller } from "react-hook-form";

import { usePricingSimulation } from "../hooks/use-pricing-simulation";

import { SimulationResult } from "../components/simulation-result";
import { OperationForm } from "../components/operation-form";

import { FormField } from "@/shared/components/fields/form-field";
import { SelectField } from "@/shared/components/fields/select-field";
import { CurrencyInput } from "@/shared/components/inputs/currency-input";
import { PercentageInput } from "@/shared/components/inputs/percentage-input";

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-slate-400";

export function PricingSimulationForm() {
  const {
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
  } = usePricingSimulation();

  const {
    register,
    control,
    formState: { errors },
  } = form;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Simulação de precificação
          </h2>

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

        <form>
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
                  form.setValue("faceValue", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
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
      </div>

      <div>
        <SimulationResult
          simulation={simulation}
          onOperate={openOperationForm}
        />

        {showOperationForm && (
          <div className="mt-6">
            <OperationForm
              loading={loadingOperation}
              onSubmit={handleOperation}
              onCancel={closeOperationForm}
            />
          </div>
        )}
      </div>
    </div>
  );
}
