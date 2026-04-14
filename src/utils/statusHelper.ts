export const getStatusType = (status: string) => {
  switch (status) {
    case 'Trip Confirmed':
    case 'Payment Received':
    case 'Confirmed':
      return 'success';
    case 'Cancelled':
      return 'danger';
    case 'In Discussion':
    case 'Assigned':
      return 'warning';
    case 'Booking Started':
      return 'info';
    case 'Lead':
      return 'default';
    default:
      return 'default';
  }
};