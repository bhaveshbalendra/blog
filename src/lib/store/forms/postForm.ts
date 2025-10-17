import { create } from "zustand";

export interface PostFormData {
  title: string;
  content: string;
  published: boolean;
  categoryIds: string[];
}

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
  updateField: (field: keyof PostFormData, value: any) => void;
  updateFormData: (data: Partial<PostFormData>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  validateForm: () => boolean;
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

    // Clear error for this field
    const { errors } = get();
    if (errors[field]) {
      set({ errors: { ...errors, [field]: "" } });
    }
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
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    if (formData.title.length > 100) {
      errors.title = "Title must be less than 100 characters";
    }

    if (formData.content.length > 10000) {
      errors.content = "Content must be less than 10,000 characters";
    }

    set({ errors, isValid: Object.keys(errors).length === 0 });
    return Object.keys(errors).length === 0;
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
