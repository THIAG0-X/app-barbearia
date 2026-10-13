import { useContext } from 'react';
import { AgendaContext } from '@/context/AgendaContext';

export function useAgenda() {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error('useAgenda deve ser usado dentro de <AgendaProvider>');
  return ctx;
}
