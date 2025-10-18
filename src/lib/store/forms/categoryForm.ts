import { categoryFormSchema } from "@/lib/zod/schemas/categories";
import { z } from "zod";
import { create } from "zustand";

export interface CategoryFormData {
  name: string;
  description: string;
}

export type CategoryFormDataSchema = z.infer<typeof categoryFormSchema>;

interface CategoryFormStore {
  // Form data
  formData: CategoryFormData;

  // Form state
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;

  // Validation errors
  errors: Record<string, string>;

  // Actions
  updateField: (field: keyof CategoryFormData, value: string) => void;
  updateFormData: (data: Partial<CategoryFormData>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  validateForm: () => boolean;
  validateField: (field: keyof CategoryFormData) => boolean;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  markAsDirty: () => void;
  markAsClean: () => void;
}

const initialFormData: CategoryFormData = {
  name: "",
  description: "",
};

export const useCategoryFormStore = create<CategoryFormStore>((set, get) => ({
  // Initial state
  formData: initialFormData,
  isDirty: false,
  isValid: false,
  isSubmitting: false,
  errors: {},

  // Actions
  updateField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      isDirty: true,
    }));

    // Validate the field after updating
    get().validateField(field);
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      isDirty: true,
    }));
  },

  setErrors: (errors) => set({ errors }),

  clearErrors: () => set({ errors: {} }),

  validateForm: () => {
    const { formData } = get();

    try {
      // Validate using Zod schema
      categoryFormSchema.parse(formData);

      // If validation passes, clear errors
      set({ errors: {}, isValid: true });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const errors: Record<string, string> = {};

        error.issues.forEach((err) => {
          const field = err.path[0] as string;
          if (field) {
            errors[field] = err.message;
          }
        });

        set({ errors, isValid: false });
        return false;
      }

      // Handle unexpected errors
      set({
        errors: { general: "An unexpected validation error occurred" },
        isValid: false,
      });
      return false;
    }
  },

  validateField: (field: keyof CategoryFormData) => {
    const { formData } = get();

    try {
      // Create a partial schema for the specific field
      const fieldSchema = categoryFormSchema.pick({ [field]: true });
      fieldSchema.parse({ [field]: formData[field] });

      // Clear error for this field
      const { errors } = get();
      if (errors[field]) {
        set({ errors: { ...errors, [field]: "" } });
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((err) => err.path[0] === field);
        if (fieldError) {
          const { errors } = get();
          set({ errors: { ...errors, [field]: fieldError.message } });
        }
      }
      return false;
    }
  },

  resetForm: () =>
    set({
      formData: initialFormData,
      isDirty: false,
      isValid: false,
      errors: {},
      isSubmitting: false,
    }),

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  markAsDirty: () => set({ isDirty: true }),

  markAsClean: () => set({ isDirty: false }),
}));
