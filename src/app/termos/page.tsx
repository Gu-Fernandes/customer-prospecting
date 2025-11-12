import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Prospecção de clientes",
  description:
    "Termos de Uso do sistema Prospecção de clientes: regras de uso, responsabilidades e condições gerais.",
};

export default function TermsPage() {
  const updatedAt = "12 de novembro de 2025";

  return (
    <div className="w-full max-w-3xl pb-3 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Termos de Uso
        </h1>
        <p className="text-sm text-muted-foreground">
          Atualizado em: {updatedAt}
        </p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed">
        <p>
          Bem-vindo ao <strong>Prospecção de clientes</strong> (“Plataforma”).
          Ao acessar ou utilizar a Plataforma, você concorda integralmente com
          estes Termos de Uso. Se não concordar, não utilize a aplicação.
        </p>

        <h2 className="text-base font-semibold">1) Objeto</h2>
        <p>
          A Plataforma auxilia equipes e profissionais a organizar{" "}
          <em>leads</em>, contatos e oportunidades comerciais, centralizando
          informações como empresa, CNPJ, responsável, telefone, e-mail,
          produto/SKU e fornecedor.
        </p>

        <h2 className="text-base font-semibold">
          2) Conta, acesso e segurança
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Você é responsável pela veracidade dos dados cadastrados.</li>
          <li>
            Guarde suas credenciais em sigilo. Tokens de sessão podem ser
            armazenados no seu dispositivo para mantê-lo conectado.
          </li>
          <li>
            Avise-nos em caso de suspeita de uso indevido ou acesso não
            autorizado.
          </li>
        </ul>

        <h2 className="text-base font-semibold">
          3) Conteúdo inserido (leads/clientes)
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Você é o único responsável pelos dados de clientes/leads que incluir
            (ex.: empresa, CNPJ, contatos).
          </li>
          <li>
            Não insira dados sensíveis (ex.: saúde, biometria, opiniões
            políticas) ou dados desnecessários à finalidade de prospecção.
          </li>
          <li>
            Ao incluir dados de terceiros, você declara possuir base legal e
            legitimidade para o tratamento (ex.: legítimo interesse ou
            consentimento, conforme a LGPD — Lei nº 13.709/2018).
          </li>
        </ul>

        <h2 className="text-base font-semibold">4) Uso aceitável</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Proibido usar a Plataforma para SPAM, fraude ou atividades ilegais.
          </li>
          <li>
            É vedada a engenharia reversa, o uso automatizado abusivo ou
            qualquer tentativa de comprometer a segurança/estabilidade do
            serviço.
          </li>
        </ul>

        <h2 className="text-base font-semibold">
          5) Disponibilidade, alterações e suporte
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            A Plataforma pode passar por manutenção, atualizações e melhorias.
          </li>
          <li>
            Podemos alterar estes Termos a qualquer momento; mudanças relevantes
            serão comunicadas. O uso contínuo após a atualização implica
            concordância.
          </li>
          <li>
            Canais de contato:{" "}
            <a
              className="underline underline-offset-2 hover:text-foreground"
              href="mailto:contato@exemplo.com"
            >
              contato@exemplo.com
            </a>
            .
          </li>
        </ul>

        <h2 className="text-base font-semibold">6) Provedores e integrações</h2>
        <p>
          Utilizamos provedores de infraestrutura e banco de dados para operar a
          Plataforma (ex.: Vercel, Render, Supabase/PostgreSQL). Esses
          fornecedores podem tratar dados em nosso nome como operadores.
        </p>

        <h2 className="text-base font-semibold">7) Propriedade intelectual</h2>
        <p>
          O código, layout e demais elementos da Plataforma são protegidos por
          direitos autorais e outras leis aplicáveis. Você recebe uma licença
          limitada, não exclusiva e intransferível para uso da Plataforma.
        </p>

        <h2 className="text-base font-semibold">
          8) Limitação de responsabilidade
        </h2>
        <p>
          A Plataforma é fornecida “no estado em que se encontra”. Não
          garantimos resultados comerciais. Na extensão máxima permitida em lei,
          não nos responsabilizamos por lucros cessantes, perdas de dados ou
          danos indiretos decorrentes do uso ou da indisponibilidade do serviço.
        </p>

        <h2 className="text-base font-semibold">9) Lei aplicável</h2>
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil.
          Eventuais controvérsias serão resolvidas pelos tribunais competentes,
          observado o foro legal aplicável.
        </p>

        <p className="text-xs text-muted-foreground">
          Nota: este texto tem caráter informativo e não substitui
          aconselhamento jurídico.
        </p>
      </section>
    </div>
  );
}
