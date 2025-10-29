<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
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
>>>>>>> de404d0327b6feeaaaa8957362a9131c53666a4d
