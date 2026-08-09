"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { operationSchema, type OperationFormData } from "../schema";
import { FormField } from "@/shared/components/fields/form-field";

type OperationFormProps = {
  loading: boolean;
  onSubmit: (data: OperationFormData) => void;
  onCancel: () => void;
};

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-slate-400";

export function OperationForm({
  loading,
  onSubmit,
  onCancel,
}: OperationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperationFormData>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      assignorName: "",
      assignorDocument: "",
    },
  });

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">Efetivar operação</h3>
        <p className="mt-1 text-sm text-slate-400">
          Informe os dados do cedente para cadastrar o recebível e realizar a
          liquidação.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-5 sm:grid-cols-2"
      >
        <FormField
          id="assignorName"
          label="Nome do cedente"
          error={errors.assignorName?.message}
        >
          <input
            id="assignorName"
            type="text"
            placeholder="Empresa ABC Ltda"
            {...register("assignorName")}
            className={inputClassName}
            disabled={loading}
          />
        </FormField>

        <FormField
          id="assignorDocument"
          label="Documento do cedente"
          error={errors.assignorDocument?.message}
        >
          <input
            id="assignorDocument"
            type="text"
            inputMode="numeric"
            placeholder="12345678000190"
            {...register("assignorDocument")}
            className={inputClassName}
            disabled={loading}
          />
        </FormField>

        <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processando..." : "Confirmar operação"}
          </button>
        </div>
      </form>
    </div>
  );
}
