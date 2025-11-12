import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Prospecção de clientes",
  description:
    "Política de Privacidade do sistema Prospecção de clientes em conformidade com a LGPD.",
};

export default function PrivacyPage() {
  const updatedAt = "12 de novembro de 2025";

  return (
    <div className="w-full max-w-3xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground">
          Atualizada em: {updatedAt}
        </p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed">
        <p>
          Esta Política explica como o <strong>Prospecção de clientes</strong>
          (“Plataforma”) coleta, usa e protege dados pessoais, em conformidade
          com a <strong>LGPD (Lei nº 13.709/2018)</strong>.
        </p>

        <h2 className="text-base font-semibold">1) Controlador e contato</h2>
        <p>
          Controlador: <strong>Prospecção de clientes</strong>. Contato do
          encarregado (DPO):{" "}
          <a
            href="mailto:privacidade@exemplo.com"
            className="underline underline-offset-2 hover:text-foreground"
          >
            privacidade@exemplo.com
          </a>
          .
        </p>

        <h2 className="text-base font-semibold">2) Dados que coletamos</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Conta e autenticação:</strong> e-mail, nome (se informado) e
            tokens de acesso armazenados no seu dispositivo para manter a
            sessão.
          </li>
          <li>
            <strong>Prospeção (clientes/leads):</strong> empresa, CNPJ,
            responsável, telefone, e-mail, produto/SKU, fornecedor e anotações
            relacionadas ao relacionamento comercial.
          </li>
          <li>
            <strong>Uso e logs:</strong> registros técnicos mínimos para
            segurança, suporte e diagnóstico (ex.: data/hora, eventos de erro).
          </li>
          <li>
            <strong>Cookies/localStorage:</strong> podemos utilizar
            armazenamento local para gerenciar sua sessão e preferências.
          </li>
        </ul>

        <h2 className="text-base font-semibold">
          3) Finalidades e bases legais
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Prestação do serviço</strong> (execução de contrato):
            permitir seu login e uso da Plataforma.
          </li>
          <li>
            <strong>Gestão de leads/clientes</strong> (legítimo interesse do
            controlador e do usuário): organizar dados comerciais estritamente
            necessários à prospecção.
          </li>
          <li>
            <strong>Segurança e prevenção a fraudes</strong> (legítimo
            interesse).
          </li>
          <li>
            <strong>Comunicações</strong> (consentimento quando exigido).
          </li>
          <li>
            <strong>Obrigações legais/regulatórias</strong>, quando aplicável.
          </li>
        </ul>

        <h2 className="text-base font-semibold">
          4) Compartilhamento com operadores
        </h2>
        <p>
          Podemos compartilhar dados com provedores que processam informações em
          nosso nome: hospedagem e entrega de aplicação (ex.: Vercel), execução
          de backend (ex.: Render) e banco de dados (ex.: Supabase/PostgreSQL).
          Esses operadores seguem nossas instruções e medidas de segurança.
        </p>

        <h2 className="text-base font-semibold">
          5) Transferências internacionais
        </h2>
        <p>
          Dados podem ser armazenados/transferidos para países com padrões de
          proteção distintos. Adotamos salvaguardas contratuais e técnicas para
          proteger seus dados.
        </p>

        <h2 className="text-base font-semibold">6) Retenção e descarte</h2>
        <p>
          Mantemos dados enquanto sua conta estiver ativa e pelo tempo
          necessário para cumprir as finalidades acima. Após esse período,
          eliminamos ou anonimizamos conforme a LGPD e nossas obrigações legais.
        </p>

        <h2 className="text-base font-semibold">
          7) Direitos do titular (LGPD)
        </h2>
        <p>Você pode exercer, entre outros, os seguintes direitos:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>confirmação de tratamento e acesso aos dados;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>portabilidade, nos termos da regulamentação;</li>
          <li>eliminação dos dados tratados com consentimento;</li>
          <li>
            informação sobre compartilhamentos e sobre a possibilidade de não
            fornecer consentimento e suas consequências;
          </li>
          <li>revogação do consentimento, quando aplicável.</li>
        </ul>
        <p>
          Para exercer seus direitos, contate:{" "}
          <a
            href="mailto:privacidade@exemplo.com"
            className="underline underline-offset-2 hover:text-foreground"
          >
            privacidade@exemplo.com
          </a>
          .
        </p>

        <h2 className="text-base font-semibold">8) Segurança</h2>
        <p>
          Aplicamos medidas técnicas e organizacionais adequadas (ex.: controle
          de acesso, criptografia em trânsito). Nenhum sistema, contudo, é 100%
          seguro; recomendamos boas práticas de senhas e proteção do seu
          dispositivo.
        </p>

        <h2 className="text-base font-semibold">
          9) Atualizações desta Política
        </h2>
        <p>
          Podemos atualizar esta Política para refletir melhorias ou exigências
          legais. Publicaremos a nova versão com a data de atualização e, quando
          cabível, notificaremos você.
        </p>

        <p className="text-xs text-muted-foreground">
          Nota: este texto tem caráter informativo e não substitui
          aconselhamento jurídico.
        </p>
      </section>
    </div>
  );
}
