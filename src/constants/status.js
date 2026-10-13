import { colors } from '@/theme/colors';

export const STATUS_CONFIG = {
  pendente: { cor: colors.primary, label: 'Pendente', icone: 'time-outline' },
  concluido: { cor: colors.success, label: 'Concluído', icone: 'checkmark-circle' },
  cancelado: { cor: colors.danger, label: 'Cancelado', icone: 'close-circle' },
};

export const FILTROS_STATUS = ['todos', 'pendente', 'concluido', 'cancelado'];
