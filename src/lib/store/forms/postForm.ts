import { postFormSchema } from "@/lib/zod/schemas/post";
import { z } from "zod";
import { create } from "zustand";

export interface PostFormData {
  title: string;
  content: string;
  published: boolean;
  categoryIds: string[];
}

export type PostFormDataSchema = z.infer<typeof postFormSchema>;

interface PostFormStore {
  // Form data
  formData: PostFormData;

  // Form state
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;

  // Validation errors
  errors: Record<string, string>;

  // Actions
  updateField: (
    field: keyof PostFormData,
    value: string | boolean | string[]
  ) => void;
  updateFormData: (data: Partial<PostFormData>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  validateForm: () => boolean;
  validateField: (field: keyof PostFormData) => boolean;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  markAsDirty: () => void;
  markAsClean: () => void;
}

const initialFormData: PostFormData = {
  title: "",
  content: "",
  published: false,
  categoryIds: [],
};

export const usePostFormStore = create<PostFormStore>((set, get) => ({
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
      postFormSchema.parse(formData);

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

  validateField: (field: keyof PostFormData) => {
    const { formData } = get();

    try {
      // Create a partial schema for the specific field
      const fieldSchema = postFormSchema.pick({ [field]: true });
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
