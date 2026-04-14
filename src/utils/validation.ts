export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateContact = (contact: string): boolean => {
  return validateEmail(contact) || validatePhone(contact);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateNumber = (value: string, min: number = 0): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min;
};

export const validatePositiveInteger = (value: string): boolean => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
};

export const getValidationError = (field: string, value: string): string | null => {
  switch (field) {
    case 'name':
      return !validateRequired(value) ? 'Name is required' : null;

    case 'contact':
      if (!validateRequired(value)) return 'Contact information is required';
      if (!validateContact(value)) return 'Please enter a valid email or phone number';
      return null;

    case 'destination':
      return !validateRequired(value) ? 'Destination is required' : null;

    case 'email':
      if (!validateRequired(value)) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      return null;

    case 'password':
      if (!validateRequired(value)) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return null;

    case 'travelersCount':
      if (value && !validatePositiveInteger(value)) return 'Please enter a valid number of travelers';
      return null;

    case 'totalCost':
      if (value && !validateNumber(value, 0)) return 'Please enter a valid cost';
      return null;

    default:
      return null;
  }
};

export interface ClientFormData {
  name: string;
  contact: string;
  destination: string;
  travelDates: string;
  travelersCount: string;
  leadSource: string;
  assignedAgent: string;
  totalCost: string;
}

export interface ValidationErrors {
  name?: string;
  contact?: string;
  destination?: string;
  travelDates?: string;
  travelersCount?: string;
  leadSource?: string;
  assignedAgent?: string;
  totalCost?: string;
}

export const validateClientForm = (data: ClientFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!validateRequired(data.name)) {
    errors.name = 'Full name is required';
  }

if (!validateRequired(data.contact)) {
  errors.contact = 'Phone Number is required';
} else if (!validatePhone(data.contact)) {
  errors.contact = 'Phone number must be at least 10 digits';
}

  if (!validateRequired(data.destination)) {
    errors.destination = 'Destination is required';
  }

  if (!validateRequired(data.travelDates)) {
    errors.travelDates = 'Travel dates required';
  }

  if (!validatePositiveInteger(data.travelersCount)) {
    errors.travelersCount = 'Enter valid travelers count';
  }

  if (!validateRequired(data.leadSource)) {
    errors.leadSource = 'Lead source required';
  }

  if (!validateRequired(data.assignedAgent)) {
    errors.assignedAgent = 'Agent required';
  }

  if (!data.totalCost || !validateNumber(data.totalCost, 0)) {
    errors.totalCost = 'Enter valid cost';
  }

  return errors;
};

export interface BookingFormData {
  clientId: string;
  bookingName: string;
  bookingRoutes: string;
  bookingCost: string;
}

export interface BookingValidationErrors {
  general?: string;
  bookingName?: string;
  bookingRoutes?: string;
  bookingCost?: string;
}

export const validateBookingForm = (data: BookingFormData): BookingValidationErrors => {
  const errors: BookingValidationErrors = {};

  if (!data.clientId) {
    errors.general = 'Open a client before creating a booking.';
  }

  if (!validateRequired(data.bookingName)) {
    errors.bookingName = 'Booking name is required';
  }

  if (!validateRequired(data.bookingRoutes)) {
    errors.bookingRoutes = 'Add booking routes';
  }

  const cost = Number(data.bookingCost);
  if (!cost || cost <= 0) {
    errors.bookingCost = 'Enter a valid cost';
  }

  return errors;
};

export interface CancellationData {
  reason: string;
  refundAmount: string;
}

export interface CancellationErrors {
  reason?: string;
  refundAmount?: string;
}

export const validateCancellation = (data: CancellationData, maxRefund: number): CancellationErrors => {
  const errors: CancellationErrors = {};

  if (!validateRequired(data.reason)) {
    errors.reason = 'Cancellation reason is required';
  }

  const refundAmount = Number(data.refundAmount);
  if (!data.refundAmount || isNaN(refundAmount) || refundAmount < 0 || refundAmount > maxRefund) {
    errors.refundAmount = `Refund must be between 0 and ${maxRefund}`;
  }

  return errors;
};