import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  class: z.string().min(1, "Classe é obrigatória"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  photo: z.any().refine((file) => file !== undefined, {
    message: "Foto é obrigatória",
  }),
});


export const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;