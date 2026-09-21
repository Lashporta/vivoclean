import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useSiteContent() {
  return useQuery({
    queryKey: ['siteContent'],
    queryFn: async () => {
      const list = await base44.entities.SiteContent.list();
      return list[0] || null;
    },
    staleTime: 60000,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const list = await base44.entities.Service.list('order', 100);
      return list;
    },
    staleTime: 60000,
  });
}

export function useService(slug) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const list = await base44.entities.Service.filter({ slug });
      return list[0] || null;
    },
    enabled: !!slug,
    staleTime: 60000,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const list = await base44.entities.Testimonial.list('order', 50);
      return list;
    },
    staleTime: 60000,
  });
}

export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const list = await base44.entities.Feature.list('order', 50);
      return list;
    },
    staleTime: 60000,
  });
}

export function useFaqs(serviceSlug) {
  return useQuery({
    queryKey: ['faqs', serviceSlug],
    queryFn: async () => {
      const list = await base44.entities.FaqItem.list('order', 50);
      if (!serviceSlug) return list.filter((f) => !f.service_slug);
      return list.filter((f) => !f.service_slug || f.service_slug === serviceSlug);
    },
    staleTime: 60000,
  });
}

export function usePrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: async () => {
      const list = await base44.entities.PriceItem.list('order', 100);
      return list;
    },
    staleTime: 60000,
  });
}