// Utilitários de data SEMPRE em horário local.
// Evita o bug de `toISOString()` (UTC), que no Brasil vira "amanhã" após 21h,
// e de `new Date('YYYY-MM-DD')`, que é interpretado como UTC.

export const toISODate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const parseISODate = (iso, hhmm = '00:00') => {
  const [y, m, d] = iso.split('-').map(Number);
  const [h, min] = hhmm.split(':').map(Number);
  return new Date(y, m - 1, d, h, min);
};

export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

export const formatarData = (iso, options) =>
  parseISODate(iso, '12:00').toLocaleDateString('pt-BR', options);

export const gerarProximosDias = (qtd = 14) =>
  Array.from({ length: qtd }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      iso: toISODate(d),
      label: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
      dia: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      num: d.getDate(),
    };
  });
