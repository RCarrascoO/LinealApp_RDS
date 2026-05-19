import { RutForm } from '@/components/RutForm';

export default function Home() {
  return (
    <main className="bg-background px-4 py-6 lg:px-6">
      <div className="mx-auto flex w-full max-w-[1200px] justify-center">
        <section className="w-full max-w-[560px]">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Validación RUT
            </p>
            <h2 className="mt-2 text-[24px] font-bold leading-8 text-foreground">
              Ingresa tu RUT para iniciar el flujo
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Esta pantalla solo muestra la validación de RUT, como entrada principal del proyecto.
            </p>
          </div>
          <RutForm onValidated={() => undefined} />
        </section>
      </div>
    </main>
  );
}