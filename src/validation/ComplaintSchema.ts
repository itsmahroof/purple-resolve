import { z } from "zod";

export const ComplaintSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  category: z.string().min(3, "Category must be at least 3 characters").max(50, "Category must be less than 50 characters"),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" })
  }),
});

export const AdminNoteSchema = z.object({
  admin_note: z.string().trim().max(300, "Admin note must be less than 300 characters").optional().nullable(),
});

export const ComplaintUpdateSchema = z.object({
  status: z.enum(["Pending", "In Review", "Resolved"], {
    errorMap: () => ({ message: "Status must be Pending, In Review, or Resolved" })
  }),
  admin_note: z.string().trim().max(300, "Admin note must be less than 300 characters").optional().nullable(),
});

export type ComplaintFormData = z.infer<typeof ComplaintSchema>;
export type AdminNoteFormData = z.infer<typeof AdminNoteSchema>;
export type ComplaintUpdateFormData = z.infer<typeof ComplaintUpdateSchema>;
