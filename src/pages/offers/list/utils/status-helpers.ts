export function getStatusColor(
  status: string,
): 'success' | 'warning' | 'info' | 'default' | 'error' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'active':
      return 'info';
    case 'processing':
      return 'warning';
    case 'pending':
      return 'default';
    default:
      return 'default';
  }
}
