// ─────────────────────────────────────────────────────────────
//  mockData.js  —  dados simulados do BarberPro
//  Substitua por chamadas reais de API/Firebase no futuro
// ─────────────────────────────────────────────────────────────

export const USUARIOS = [
    // CLIENTES
    { id: "c1", nome: "Lucas Oliveira",   email: "lucas@email.com",   senha: "123456", tipo: "cliente",  foto: null },
    { id: "c2", nome: "Ana Paula",        email: "ana@email.com",     senha: "123456", tipo: "cliente",  foto: null },
    // BARBEIROS
    { id: "b1", nome: "Roberto Silva",    email: "roberto@email.com", senha: "123456", tipo: "barbeiro", foto: null, especialidade: "Corte & Barba" },
    { id: "b2", nome: "Carlos Mendes",    email: "carlos@email.com",  senha: "123456", tipo: "barbeiro", foto: null, especialidade: "Corte Degradê" },
    { id: "b3", nome: "João Ferreira",    email: "joao@email.com",    senha: "123456", tipo: "barbeiro", foto: null, especialidade: "Barba & Bigode" },
    { id: "b4", nome: "Paulo Costa",      email: "paulo@email.com",   senha: "123456", tipo: "barbeiro", foto: null, especialidade: "Corte Infantil" },
];

export const SERVICOS = [
    { id: "s1", nome: "Combo Corte + Barba", preco: 50, duracao: 40, barbeiros: ["b1","b2","b3","b4"] },
    { id: "s2", nome: "Corte Simples",        preco: 25, duracao: 20, barbeiros: ["b1","b2","b3","b4"] },
    { id: "s3", nome: "Corte Degradê",        preco: 35, duracao: 30, barbeiros: ["b2","b4"] },
    { id: "s4", nome: "Barba",                preco: 25, duracao: 20, barbeiros: ["b1","b3"] },
    { id: "s5", nome: "Sombrancelha",         preco: 10, duracao: 15, barbeiros: ["b1","b2","b3","b4"] },
    { id: "s6", nome: "Barba + Bigode",       preco: 30, duracao: 25, barbeiros: ["b3"] },
];

// Horários base que cada barbeiro pode oferecer
export const HORARIOS_BASE = [
    "08:00","08:30","09:00","09:30","10:00","10:30",
    "11:00","11:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30",
];

// Agendamentos mockados (estado inicial)
export const AGENDAMENTOS_INICIAIS = [
    {
        id: "ag1",
        clienteId: "c1",
        barbeiroId: "b1",
        servicoId: "s1",
        data: "2025-07-10",
        horario: "09:00",
        status: "concluido", // pendente | concluido | cancelado
    },
    {
        id: "ag2",
        clienteId: "c1",
        barbeiroId: "b2",
        servicoId: "s3",
        data: "2025-07-15",
        horario: "10:00",
        status: "concluido",
    },
    {
        id: "ag3",
        clienteId: "c2",
        barbeiroId: "b1",
        servicoId: "s2",
        data: "2025-07-18",
        horario: "11:00",
        status: "concluido",
    },
    {
        id: "ag4",
        clienteId: "c1",
        barbeiroId: "b1",
        servicoId: "s1",
        data: "2025-07-22",
        horario: "09:00",
        status: "concluido",
    },
    {
        id: "ag5",
        clienteId: "c2",
        barbeiroId: "b2",
        servicoId: "s3",
        data: "2025-07-24",
        horario: "14:00",
        status: "concluido",
    },
    {
        id: "ag6",
        clienteId: "c1",
        barbeiroId: "b3",
        servicoId: "s4",
        data: "2025-07-28",
        horario: "15:00",
        status: "cancelado",
    },
    // Agendamentos futuros
    {
        id: "ag7",
        clienteId: "c1",
        barbeiroId: "b1",
        servicoId: "s1",
        data: "2025-08-05",
        horario: "09:00",
        status: "pendente",
    },
    {
        id: "ag8",
        clienteId: "c2",
        barbeiroId: "b1",
        servicoId: "s2",
        data: "2025-08-05",
        horario: "10:00",
        status: "pendente",
    },
    {
        id: "ag9",
        clienteId: "c1",
        barbeiroId: "b2",
        servicoId: "s3",
        data: "2025-08-07",
        horario: "14:00",
        status: "pendente",
    },
];

// Helpers
export function getBarbeiro(id) {
    return USUARIOS.find(u => u.id === id);
}
export function getCliente(id) {
    return USUARIOS.find(u => u.id === id);
}
export function getServico(id) {
    return SERVICOS.find(s => s.id === id);
}
export function getBarbeiros() {
    return USUARIOS.filter(u => u.tipo === "barbeiro");
}