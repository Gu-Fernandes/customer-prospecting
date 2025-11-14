import { FeatureCard } from "./feature-card";

export function HomeCards() {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
      <FeatureCard
        icon="building"
        title="Cadastro de Cliente"
        description="Registrar empresa, responsável, contato e produtos."
        href="/customers/new"
        buttonText="Cadastrar cliente"
        buttonVariant="default"
      />

      <FeatureCard
        icon="zap"
        title="Prospecção"
        description="Acompanhar leads e oportunidades em andamento."
        href="/prospecting"
        buttonText="Ir para prospecção"
        buttonVariant="outline"
      />
    </div>
  );
}
