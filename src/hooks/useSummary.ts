import { useQuery } from '@tanstack/react-query';

export interface SummaryData {
  availableSpaces: number;
  totalSpaces: number;
  activeReservations: number;
  pendingRequests: number;
  registeredUsers: number;
}

const fetchSummary = async (): Promise<SummaryData> => {
  // TODO: Replace with actual fetch call
  // const response = await fetch('/api/summary');
  // if (!response.ok) {
  //   throw new Error('Failed to fetch summary data');
  // }
  // return response.json();

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Hard-coded dummy response
  return {
    availableSpaces: 23,
    totalSpaces: 50,
    activeReservations: 27,
    pendingRequests: 5,
    registeredUsers: 142,
  };
};

export function useSummary() {
  return useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
  });
}
