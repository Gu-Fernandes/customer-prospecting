# Prospecção de clientes (Frontend)

Aplicação web para cadastro e prospecção de clientes.

O objetivo do projeto é:
- cadastrar empresas / contatos comerciais com dados padronizados (CNPJ, responsável, telefone, produto principal etc.)
- armazenar esses dados via API própria (FastAPI)
- visualizar a base de clientes em formato de tabela para acompanhamento comercial

Este repositório contém apenas o **front-end** (Next.js).  
O backend (FastAPI + Supabase) está em outro projeto (`prospecting-api`).

---

## Stack

### Front-end
- **Next.js (App Router)** com `page.tsx` server-side e componentes client-side
- **TypeScript**
- **Tailwind CSS** para estilização consistente e rápida
- **React Hook Form** + **Zod** para formulários com validação tipada
- Componentes de UI desacoplados e reutilizáveis:
  - `<Button />` com variants (`default`, `outline`, `ghost`, etc.)
  - `<Field />` + `<TextInput />` para inputs padronizados
  - `<SuccessModal />` para feedback de sucesso
- Ícones centralizados em um único registry (`/components/icons`), usando lucide-react

### Back-end (consumido pelo front)
- **FastAPI (Python)** servindo endpoints REST
- **Supabase (Postgres)** como banco de dados
- Endpoints para criar e listar clientes (`/customers`)
- Retorno JSON consumido direto pelo front usando `fetch`/services

---

## Funcionalidades atuais

### 1. Cadastro de Cliente
Tela de cadastro com os campos:
- Empresa
- CNPJ
- Responsável
- E-mail
- Telefone
- Produto principal
- SKU
- Fornecedor

Validações importantes:
- Todos os campos passam por validação `zod` antes de enviar.
- Alguns campos são normalizados automaticamente:
  - CNPJ e Telefone: máscara em tempo real enquanto o usuário digita  
    `00.000.000/0000-00`, `(11) 91234-5678`, etc.
  - SKU e Produto Principal: sempre forçados para MAIÚSCULO.
- Após salvar com sucesso:
  - o front chama `POST /customers` (FastAPI)
  - exibe um mini modal (`<SuccessModal />`) dizendo `"EMPRESA cadastrada com sucesso!"`
  - botão rápido para ir ver a lista de clientes / prospecção

### 2. Listagem / Prospecção
Página de prospecção mostra todos os clientes em uma tabela responsiva:
- Empresa
- CNPJ (já formatado)
- Responsável
- Telefone (já formatado)
- E-mail
- Produto (sempre maiúsculo)
- SKU (sempre maiúsculo, monoespaçado)
- Fornecedor

Também há um botão para voltar para a Home.

### 3. Home
A Home hoje funciona como um hub simples:
- Card “Cadastro de Cliente” → leva para o formulário de criação
- Card “Prospecção” → leva para a listagem de clientes

---
