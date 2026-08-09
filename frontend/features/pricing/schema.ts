import { z } from "zod";

export const pricingSimulationSchema = z.object({
  faceValue: z
    .string()
    .min(1, "Informe o valor de face.")
    .refine(
      (value) => Number(value.replace(",", ".")) > 0,
      "O valor deve ser maior que zero.",
    ),

  receivableTypeId: z.string().min(1, "Selecione o tipo de recebível."),

  operationDate: z.string().min(1, "Informe a data da operação."),

  dueDate: z.string().min(1, "Informe a data de vencimento."),

  baseRate: z
    .string()
    .min(1, "Informe a taxa base.")
    .refine(
      (value) => Number(value.replace(",", ".")) >= 0,
      "A taxa base não pode ser negativa.",
    ),

  titleCurrencyId: z.string().min(1, "Selecione a moeda do título."),

  paymentCurrencyId: z.string().min(1, "Selecione a moeda de pagamento."),
});

export type PricingSimulationFormData = z.infer<typeof pricingSimulationSchema>;




export const operationSchema = z.object({
  assignorName: z
    .string()
    .trim()
    .min(1, "Informe o nome do cedente.")
    .max(200, "O nome deve ter no máximo 200 caracteres."),

  assignorDocument: z
    .string()
    .trim()
    .min(1, "Informe o documento do cedente.")
    .max(20, "O documento deve ter no máximo 20 caracteres."),
});

export type OperationFormData = z.infer<typeof operationSchema>;