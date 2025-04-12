import { QueryClient } from '@tanstack/react-query';

export const prefetchProducts = async (queryClient: QueryClient, type: 'Clothing' | 'Accessories') => {
  const endpoint = type === 'Clothing' ? '/api/clothing' : '/api/accessories';
  
  await queryClient.prefetchQuery({
    queryKey: ['products', type],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Error fetching ${type.toLowerCase()} products`);
      const data = await response.json();
      return type === 'Clothing' ? data.clothing : data.accessories;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const prefetchProductDetails = async (queryClient: QueryClient, id: string, type: 'Clothing' | 'Accessories') => {
  const endpoint = type === 'Clothing' ? `/api/clothing/${id}` : `/api/accessories/${id}`;
  
  await queryClient.prefetchQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Error fetching product details`);
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
}; 