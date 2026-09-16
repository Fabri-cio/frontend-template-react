import { ArrowRight, Boxes, Lock, Mail } from "lucide-react";

import { Button, Input, Label } from "../../components/ui";

export function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10">
            <Boxes className="h-6 w-6" />
          </div>

          <div>
            <p className="text-lg font-bold">Frontend Template</p>
            <p className="text-sm opacity-70">Plataforma</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight">
            Plataforma operativa
            <br />
            para la gestión de tu negocio
          </h1>

          <p className="mt-4 text-lg opacity-70">
            Gestiona tus operaciones, usuarios y procesos desde un solo lugar.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Gestión centralizada de operaciones",
              "Información organizada en un solo lugar",
              "Procesos conectados y fáciles de administrar",
              "Interfaz adaptable a cada proyecto",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm opacity-70"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs opacity-50">
          © 2026 · Frontend Template
        </p>
      </div>

      {/* Panel derecho */}
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-8">
        <div className="w-full max-w-sm">
          {/* Marca móvil */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </div>

            <div>
              <p className="text-base font-bold text-foreground">
                Frontend Template
              </p>

              <p className="text-xs text-muted-foreground">Plataforma</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Iniciar sesión</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Accede a tu plataforma
          </p>

          <form className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>

              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="pl-9"
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>

              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="pl-9"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth>
              Ingresar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
