"use client";

import { useCreateReceivableForm } from "../hooks/use-create-receivable-form";
import { ReceivableFormFields } from "../components/receivable-form-fields";
import { SimulationRecebiveis } from "../components/simulation-recebiveis";

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-slate-400";

export const CreateRecebiveisForm = () => {
  const {
    form,
    types,
    currencies,
    preview,
    selectedType,
    loading,
    message,
    updateField,
    handleSubmit,
  } = useCreateReceivableForm();
  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[1.1fr_0.7fr]"
    >
      <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <ReceivableFormFields
          form={form}
          types={types}
          currencies={currencies}
          inputClassName={inputClassName}
          updateField={updateField}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Enviando..." : "Criar recebível"}
        </button>

        {message ? (
          <p className="mt-4 text-sm text-emerald-300">{message}</p>
        ) : null}
      </section>

      <SimulationRecebiveis selectedType={selectedType} preview={preview} />
    </form>
  );
};
