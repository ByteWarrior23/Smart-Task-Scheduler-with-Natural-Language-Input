import { userSchema, taskSchema } from '../api/types';

// Validation utilities
export const validateField = (value, rules) => {
  if (rules.required && (!value || value.trim() === '')) {
    return 'This field is required';
  }
  
  if (value && rules.min && value.length < rules.min) {
    return `Minimum length is ${rules.min} characters`;
  }
  
  if (value && rules.max && value.length > rules.max) {
    return `Maximum length is ${rules.max} characters`;
  }
  
  if (value && rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format';
  }
  
  if (value && rules.enum && !rules.enum.includes(value)) {
    return `Must be one of: ${rules.enum.join(', ')}`;
  }
  
  if (value && rules.minValue && Number(value) < rules.minValue) {
    return `Minimum value is ${rules.minValue}`;
  }
  
  if (value && rules.maxValue && Number(value) > rules.maxValue) {
    return `Maximum value is ${rules.maxValue}`;
  }
  
  return null;
};

// Form validation schemas
export const validationSchemas = {
  // User registration
  register: {
    username: (value) => validateField(value, userSchema.username),
    email: (value) => validateField(value, userSchema.email),
    fullname: (value) => validateField(value, userSchema.fullname),
    password: (value) => validateField(value, userSchema.password),
    confirmPassword: (value, formData) => {
      const passwordError = validateField(value, userSchema.password);
      if (passwordError) return passwordError;
      if (value !== formData.password) {
        return 'Passwords do not match';
      }
      return null;
    },
  },
  
  // User login
  login: {
    username: (value) => {
      if (!value || value.trim() === '') {
        return 'Username or email is required';
      }
      return null;
    },
    password: (value) => {
      if (!value || value.trim() === '') {
        return 'Password is required';
      }
      return null;
    },
  },
  
  // Change password
  changePassword: {
    currentPassword: (value) => {
      if (!value || value.trim() === '') {
        return 'Current password is required';
      }
      return null;
    },
    newPassword: (value) => validateField(value, userSchema.password),
    confirmPassword: (value, formData) => {
      const passwordError = validateField(value, userSchema.password);
      if (passwordError) return passwordError;
      if (value !== formData.newPassword) {
        return 'Passwords do not match';
      }
      return null;
    },
  },
  
  // Task creation/update
  task: {
    title: (value) => validateField(value, taskSchema.title),
    description: (value) => validateField(value, taskSchema.description),
    priority: (value) => validateField(value, taskSchema.priority),
    category: (value) => {
      if (!value || value.trim() === '') {
        return 'Category is required';
      }
      return null;
    },
    time_required: (value) => {
      if (value && (isNaN(value) || value < taskSchema.time_required.min || value > taskSchema.time_required.max)) {
        return `Must be between ${taskSchema.time_required.min} and ${taskSchema.time_required.max} minutes`;
      }
      return null;
    },
    deadline: (value) => {
      if (value && new Date(value) < new Date()) {
        return 'Deadline cannot be in the past';
      }
      return null;
    },
  },
  
  // Email configuration
  emailConfig: {
    service: (value) => {
      if (!value || value.trim() === '') {
        return 'Email service is required';
      }
      return null;
    },
    user: (value) => {
      if (!value || value.trim() === '') {
        return 'Email address is required';
      }
      if (!userSchema.email.pattern.test(value)) {
        return 'Invalid email format';
      }
      return null;
    },
    pass: (value) => {
      if (!value || value.trim() === '') {
        return 'Email password is required';
      }
      return null;
    },
    host: (value) => {
      if (value && value.trim() !== '' && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return 'Invalid host format';
      }
      return null;
    },
    port: (value) => {
      if (value && (isNaN(value) || value < 1 || value > 65535)) {
        return 'Port must be between 1 and 65535';
      }
      return null;
    },
  },
  
  // Natural language input
  naturalLanguage: {
    text: (value) => {
      if (!value || value.trim() === '') {
        return 'Please enter a task description';
      }
      if (value.length < 5) {
        return 'Please provide more details (at least 5 characters)';
      }
      return null;
    },
  },
};

// Validate entire form
export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(schema).forEach(field => {
    const error = schema[field](formData[field], formData);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });
  
  return { errors, isValid };
};

// Get field error
export const getFieldError = (field, errors) => {
  return errors[field] || null;
};

// Check if form has errors
export const hasFormErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
