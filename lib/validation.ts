// Shared validation rules for both frontend and backend

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  from?: string;
  recaptchaToken?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" });
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.name.trim())) {
    errors.push({ field: "name", message: "Name contains invalid characters" });
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.push({ field: "email", message: "Invalid email format" });
  } else if (data.email.length > 254) {
    errors.push({ field: "email", message: "Email is too long" });
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.push({ field: "message", message: "Message is required" });
  } else if (data.message.trim().length < 10) {
    errors.push({ field: "message", message: "Message must be at least 10 characters" });
  } else if (data.message.trim().length > 5000) {
    errors.push({ field: "message", message: "Message is too long (max 5000 characters)" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 5000); // Limit length
}
