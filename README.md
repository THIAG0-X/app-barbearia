# 💈 BarberPro — App Barbearia

> Aplicativo mobile de agendamento e gestão para barbearias, desenvolvido com React Native e Expo.

![React Native](https://img.shields.io/badge/React_Native-0.83.2-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.x-3178C6?style=flat&logo=typescript)
![Expo](https://img.shields.io/badge/Expo-55.x-000020?style=flat&logo=expo)
![Plataforma](https://img.shields.io/badge/Plataforma-Android%20%7C%20iOS%20%7C%20Web-green?style=flat)

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Credenciais de Demonstração](#credenciais-de-demonstração)
- [Telas e Componentes](#telas-e-componentes)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Dados Mockados](#dados-mockados)
- [Fluxo de Navegação](#fluxo-de-navegação)
- [Equipe](#equipe)
- [Licença](#licença)

---

## 📌 Sobre o Projeto

O **BarberPro** é um aplicativo mobile desenvolvido como projeto de Atividade Prática Supervisionada (APS) do curso de [**Nome do Curso**] da [**Nome da Faculdade/Universidade**].

O sistema tem como proposta a digitalização do processo de agendamento de serviços em barbearias, oferecendo dois perfis distintos de acesso: **Cliente** e **Barbeiro**. O cliente pode navegar pelos serviços disponíveis, escolher um profissional e realizar agendamentos de forma simples e intuitiva. O barbeiro acessa um painel dedicado com dashboard de métricas, agenda diária e gerenciamento de serviços e horários.

O aplicativo foi construído com **React Native** e o framework **Expo**, com navegação baseada em arquivos (**Expo Router**), estado global via **Context API** e dados simulados por um módulo de **mock data** — estruturado para fácil substituição por uma API real no futuro.

---

## 🎯 Objetivos

### Objetivo Geral

Desenvolver um aplicativo mobile funcional que automatize o processo de agendamento de serviços em barbearias, aplicando os conceitos de desenvolvimento mobile, arquitetura de componentes, gerenciamento de estado e boas práticas de código estudados ao longo do curso.

### Objetivos Específicos

- Implementar autenticação de usuários com dois perfis distintos (cliente e barbeiro), incluindo login, cadastro e logout;
- Desenvolver um fluxo de agendamento em múltiplos passos: seleção de barbeiro → serviço → data → horário → confirmação;
- Criar um painel de gestão (dashboard) para o barbeiro com métricas de atendimentos, lucro e gráfico semanal;
- Implementar agenda diária do barbeiro com ações de concluir e cancelar atendimentos;
- Criar tela de gerenciamento de serviços e horários disponíveis para o barbeiro;
- Aplicar proteção de rotas com redirecionamento automático para login quando o usuário não está autenticado;
- Construir uma Navbar adaptativa que exibe itens diferentes conforme o perfil do usuário logado;
- Utilizar Path Aliases (`@/*`) para importações limpas e organizadas;
- Estruturar o código para fácil evolução: troca do mock data por chamadas reais de API.

---

## ✅ Funcionalidades

### 👤 Perfil Cliente

- Cadastro de conta selecionando o tipo "Cliente"
- Login com redirecionamento automático para a tela Home
- **Home** com saudação personalizada, card de promoção da semana e listas horizontais de serviços e barbeiros
- **Fluxo de agendamento em 5 etapas** com barra de progresso visual:
  1. Escolha do barbeiro
  2. Escolha do serviço (filtrado pelo barbeiro selecionado)
  3. Escolha da data (próximos 14 dias)
  4. Escolha do horário (apenas horários disponíveis)
  5. Resumo e confirmação com modal de sucesso
- **Lista de agendamentos** com filtros por status (Todos, Pendente, Concluído, Cancelado)
- Cancelamento de agendamento com modal de confirmação
- **Perfil** com avatar, estatísticas (total de serviços, total gasto, barbeiros visitados) e histórico completo de atendimentos concluídos
- Logout da conta

### ✂️ Perfil Barbeiro

- Cadastro de conta selecionando o tipo "Barbeiro"
- Login com redirecionamento automático para `/barbeiro/dashboard`
- **Dashboard** com:
  - Cards de estatísticas: atendimentos no mês, na semana, clientes únicos, lucro semanal e mensal
  - Card de destaque: dia mais movimentado
  - Mini gráfico de barras: atendimentos nas últimas 4 semanas
  - Lista dos próximos 3 agendamentos pendentes
  - Botões de acesso rápido para Agenda e Gerenciar
- **Agenda diária** com seletor de dia (7 dias), linha do tempo por horário, indicador de agendamentos pendentes e ações de Concluir/Cancelar com modal de confirmação
- **Gerenciar** com abas:
  - *Serviços*: ativar/desativar serviços e editar preços inline
  - *Horários*: selecionar horários disponíveis para atendimento

### ⚙️ Geral

- Proteção de rotas com `AuthGuard` — redireciona para `/login` quando não autenticado
- Header fixo com nome do app exibido em todas as telas protegidas
- Navbar adaptativa: 4 itens para cliente, 3 itens para barbeiro
- Botões da Navbar com estado ativo/inativo visual (amarelo/azul)
- Animação de transição entre telas (`slide_from_right`)
- Telas públicas (`/login`, `/cadastro`) sem Header e Navbar
- Compatibilidade com Android, iOS e Web

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React Native | 0.83.2 | Framework de desenvolvimento mobile |
| React | 19.2.0 | Biblioteca de interface |
| Expo | 55.x | Plataforma de build e desenvolvimento |
| Expo Router | ~55.0.8 | Navegação baseada em sistema de arquivos |
| TypeScript | ~5.9.2 | Tipagem estática (configurado com strict) |
| React Navigation | 7.x | Base de navegação (Bottom Tabs) |
| AsyncStorage | 2.2.0 | Persistência de dados local no dispositivo |
| Context API (React) | — | Gerenciamento de estado global da aplicação |
| Expo Vector Icons (Ionicons) | ^15.0.3 | Biblioteca de ícones da interface |
| React Native Reanimated | 4.2.1 | Animações performáticas de interface |
| Expo Haptics | ~55.0.9 | Feedback tátil ao interagir com o app |
| Expo Splash Screen | ~55.0.13 | Tela de carregamento inicial personalizada |
| Expo Web Browser | ~55.0.10 | Abertura de links externos |
| React Native Gesture Handler | ~2.30.0 | Suporte a gestos de toque |
| React Native Safe Area Context | ~5.6.0 | Respeito às áreas seguras dos dispositivos |
| ESLint + eslint-config-expo | ^9.25.0 | Padronização e qualidade do código |

---

## 🏗️ Arquitetura do Projeto

O projeto segue o padrão **File-Based Routing** do Expo Router — cada arquivo em `src/app/` define uma rota automaticamente. O estado global é gerenciado pelo **AppContext** e distribuído via `AppProvider`. Os dados são simulados pelo módulo `mockData.js`, desacoplado do contexto, facilitando a futura integração com uma API real.

```
┌─────────────────────────────────────────────────────────────────┐
│                          BarberPro                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   AppProvider (Context API)              │   │
│  │  usuario | login | cadastrar | logout                    │   │
│  │  agendamentos | criarAgendamento | cancelarAgendamento   │   │
│  │  concluirAgendamento | horariosDisponiveis               │   │
│  │  agendamentosCliente | agendamentosBarbeiro              │   │
│  │  dashboardBarbeiro                                       │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
│               ┌───────────┴────────────┐                        │
│               ▼                        ▼                        │
│  ┌────────────────────┐   ┌────────────────────────────────┐    │
│  │  Telas Públicas    │   │          AuthGuard             │    │
│  │  /login            │   │  (redireciona se não logado)   │    │
│  │  /cadastro         │   └────────────┬───────────────────┘    │
│  └────────────────────┘                │                        │
│                              ┌─────────┴──────────┐             │
│                              ▼                    ▼             │
│               ┌──────────────────┐  ┌─────────────────────┐    │
│               │  Área Cliente    │  │   Área Barbeiro      │    │
│               │  /               │  │  /barbeiro/dashboard │    │
│               │  /agendar        │  │  /barbeiro/agenda    │    │
│               │  /agendamentos   │  │  /barbeiro/gerenciar │    │
│               │  /perfil         │  └─────────────────────┘    │
│               │  /servicos       │                              │
│               └──────────────────┘                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     mockData.js                          │   │
│  │   USUARIOS | SERVICOS | AGENDAMENTOS_INICIAIS            │   │
│  │   HORARIOS_BASE | getBarbeiro | getServico | getCliente  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
app-barbearia/
│
├── src/
│   ├── app/                          # Rotas e telas (Expo Router)
│   │   ├── barbeiro/                 # Área exclusiva do barbeiro
│   │   │   ├── agenda.jsx            # Agenda diária com linha do tempo
│   │   │   ├── dashboard.jsx         # Dashboard com métricas e gráfico
│   │   │   └── gerenciar.jsx         # Gerenciar serviços e horários
│   │   ├── _layout.jsx               # Layout raiz: AppProvider + AuthGuard + Header + Navbar
│   │   ├── index.jsx                 # Home do cliente (promoção, serviços, barbeiros)
│   │   ├── login.jsx                 # Tela de login com botões de demo
│   │   ├── cadastro.jsx              # Cadastro (cliente ou barbeiro)
│   │   ├── agendar.jsx               # Fluxo de agendamento em 5 steps
│   │   ├── agendamentos.jsx          # Lista de agendamentos do cliente
│   │   ├── perfil.jsx                # Perfil, estatísticas e histórico
│   │   └── servicos.jsx              # Listagem de serviços disponíveis
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── header.jsx                # Cabeçalho fixo "BarberPro"
│   │   ├── navbar.jsx                # Navbar adaptativa (cliente/barbeiro)
│   │   ├── navButton.jsx             # Botão individual da navbar com estado ativo/inativo
│   │   ├── horizontalList.jsx        # FlatList horizontal genérica via renderCard
│   │   ├── serviceCard.jsx           # Card de serviço (nome, preço, duração, botão)
│   │   ├── serviceButton.jsx         # Botão de ação que navega para agendamento
│   │   └── barberCard.jsx            # Card de barbeiro (avatar, nome, especialidade)
│   │
│   ├── context/                      # Estado global da aplicação
│   │   ├── AppContext.js             # Provider, hooks e toda lógica de negócio
│   │   └── mockData.js               # Dados simulados (usuários, serviços, agendamentos)
│   │
│   ├── hooks/                        # Custom hooks
│   └── assets/                       # Imagens, fontes e recursos estáticos
│
├── scripts/
│   └── reset-project.js              # Script utilitário do Expo
│
├── app.json                          # Configuração do Expo (nome, ícone, splash)
├── package.json                      # Dependências e scripts do projeto
├── tsconfig.json                     # TypeScript com strict + path aliases @/*
├── eslint.config.js                  # Configuração do ESLint
└── README.md                         # Documentação do projeto
```

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) versão **18 ou superior**
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** no celular:
  - [Android — Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS — App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/THIAG0-X/app-barbearia.git
cd app-barbearia
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm start
```

### 4. Execute em cada plataforma

```bash
npm run android   # Abre no emulador Android ou dispositivo físico
npm run ios       # Abre no simulador iOS (requer macOS + Xcode)
npm run web       # Abre no navegador
```

### 5. Abrir no dispositivo físico

Após iniciar com `npm start`, escaneie o **QR Code** exibido no terminal usando o aplicativo **Expo Go** instalado no celular.

---

## 🔑 Credenciais de Demonstração

A tela de login disponibiliza botões de acesso rápido para testes:

| Perfil | E-mail | Senha |
|---|---|---|
| 👤 Cliente | lucas@email.com | 123456 |
| 👤 Cliente | ana@email.com | 123456 |
| ✂️ Barbeiro | roberto@email.com | 123456 |
| ✂️ Barbeiro | carlos@email.com | 123456 |
| ✂️ Barbeiro | joao@email.com | 123456 |
| ✂️ Barbeiro | paulo@email.com | 123456 |

> Também é possível criar uma nova conta diretamente pelo botão **"Cadastre-se"** na tela de login.

---

## 📱 Telas e Componentes

### Telas

| Rota | Arquivo | Descrição |
|---|---|---|
| `/login` | `login.jsx` | Autenticação com botões de acesso demo |
| `/cadastro` | `cadastro.jsx` | Cadastro com seleção de perfil (cliente/barbeiro) |
| `/` | `index.jsx` | Home do cliente: promoção, serviços e barbeiros |
| `/agendar` | `agendar.jsx` | Fluxo de agendamento em 5 etapas com progresso |
| `/agendamentos` | `agendamentos.jsx` | Lista de agendamentos com filtros e cancelamento |
| `/perfil` | `perfil.jsx` | Perfil, estatísticas e histórico do cliente |
| `/servicos` | `servicos.jsx` | Listagem de serviços disponíveis |
| `/barbeiro/dashboard` | `barbeiro/dashboard.jsx` | Dashboard com métricas, gráfico e próximos agendamentos |
| `/barbeiro/agenda` | `barbeiro/agenda.jsx` | Agenda diária com linha do tempo e ações |
| `/barbeiro/gerenciar` | `barbeiro/gerenciar.jsx` | Gerenciamento de serviços e horários |

### Componentes Reutilizáveis

| Componente | Descrição |
|---|---|
| `Header` | Cabeçalho fixo com o nome "BarberPro" em fundo azul escuro (`#1E3A8A`) |
| `Navbar` | Barra de navegação inferior adaptativa — 4 itens para cliente, 3 para barbeiro |
| `NavButton` | Botão da navbar: ativo = fundo amarelo + ícone preto, inativo = fundo azul + ícone branco |
| `HorizontalList` | `FlatList` horizontal genérica que recebe qualquer card via prop `renderCard` |
| `ServiceCard` | Card de serviço com nome, preço, duração e botão "Agende agora!" |
| `ServiceButton` | Botão amarelo standalone que navega para o fluxo de agendamento passando `servicoId` |
| `BarberCard` | Card de barbeiro com avatar circular, nome e especialidade |

---

## 🧠 Gerenciamento de Estado

O estado global da aplicação é centralizado no **AppContext** (`src/context/AppContext.js`), implementado com a **Context API** do React. O contexto é disponibilizado para toda a árvore via `AppProvider` no `_layout.jsx`.

### Dados e Funções Expostos pelo Contexto

| Dado / Função | Tipo | Descrição |
|---|---|---|
| `usuario` | `Object \| null` | Usuário atualmente logado |
| `agendamentos` | `Array` | Lista completa de agendamentos em memória |
| `login(email, senha)` | `Function` | Autentica e retorna `{ ok, tipo }` ou `{ ok, erro }` |
| `cadastrar(nome, email, senha, tipo)` | `Function` | Cria novo usuário e já realiza o login |
| `logout()` | `Function` | Limpa o estado do usuário logado |
| `horariosDisponiveis(barbeiroId, data)` | `Function` | Retorna horários livres filtrando os já ocupados |
| `criarAgendamento({...})` | `Function` | Cria agendamento verificando conflito de horário |
| `cancelarAgendamento(id)` | `Function` | Muda status para `"cancelado"` |
| `concluirAgendamento(id)` | `Function` | Muda status para `"concluido"` |
| `agendamentosCliente(clienteId)` | `Function` | Filtra agendamentos pelo ID do cliente |
| `agendamentosBarbeiro(barbeiroId)` | `Function` | Filtra agendamentos pelo ID do barbeiro |
| `dashboardBarbeiro(barbeiroId)` | `Function` | Retorna métricas calculadas para o dashboard |

### Proteção de Rotas (AuthGuard)

O componente `AuthGuard` (dentro de `_layout.jsx`) monitora as mudanças de rota via `usePathname`. Quando o usuário não estiver logado e tentar acessar uma rota protegida, é redirecionado automaticamente para `/login`.

```
Rota acessada
     │
     ▼
AuthGuard verifica `usuario`
     │
     ├── usuário logado ──► exibe a tela normalmente
     │
     └── não logado ──► router.replace("/login")
```

---

## 🗄️ Dados Mockados

O arquivo `src/context/mockData.js` centraliza todos os dados simulados, desacoplado do contexto para facilitar a futura integração com Firebase, REST API ou qualquer outro backend.

### Serviços Disponíveis

| ID | Serviço | Preço | Duração | Barbeiros |
|---|---|---|---|---|
| s1 | Combo Corte + Barba | R$ 50 | 40 min | Todos |
| s2 | Corte Simples | R$ 25 | 20 min | Todos |
| s3 | Corte Degradê | R$ 35 | 30 min | b2, b4 |
| s4 | Barba | R$ 25 | 20 min | b1, b3 |
| s5 | Sobrancelha | R$ 10 | 15 min | Todos |
| s6 | Barba + Bigode | R$ 30 | 25 min | b3 |

### Horários Base

16 horários disponíveis das **08:00** às **17:30**, com intervalos de 30 minutos (pausa de 12:00 às 14:00).

### Agendamentos Iniciais

9 agendamentos de demonstração distribuídos entre os usuários mockados, com status variados (`concluido`, `pendente`, `cancelado`), usados para popular o dashboard e o histórico.

---

## 🔄 Fluxo de Navegação

```
Início do App
      │
      ▼
  /login ──────────────────────────────────────────── (logout) ◄──┐
      │                                                            │
      ├── login como cliente ──► /  (Home)                        │
      │                              │                            │
      │                              ├── /agendar (5 steps)       │
      │                              │       └── /agendamentos    │
      │                              ├── /agendamentos            │
      │                              ├── /perfil ─────────────────┘
      │                              └── /servicos
      │
      └── login como barbeiro ──► /barbeiro/dashboard
                                          │
                                          ├── /barbeiro/agenda
                                          ├── /barbeiro/gerenciar
                                          └── (logout) ───────────┘
```

---

## 👨‍💻 Equipe

| Nome |
|---|---|---|
| Thiago Malta Coutinho |
| Pedro Henrique Pereira Carvalho | 
| Arylon Rosa de Carvalho |
| Edmilson de Oliveira Rodrigues |
| Theo Rodrigues Craveiro Lima |

> **Disciplina: DESENVOLVIMENTO DE APLICATIVOS MÓVEIS** 
> **Professor: Marcelo Peratoni**
> **Instituição: Unicarioca** 

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos como parte da Atividade Prática Supervisionada (APS).

---
