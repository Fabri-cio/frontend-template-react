import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Shield, XCircle } from "lucide-react";

import { adminApi } from "../admin/api";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingState,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
} from "../../components/ui";
import { ROLE_LABELS } from "../../constants";
// import { formatDate } from "../../utils"; ojo
import type { Role } from "../../types";
import UsersPage from "../usuarios/UsersPage";

const PERMISSIONS_MATRIX = [
  {
    resource: "pedido",
    actions: ["ver", "crear", "editar", "aprobar", "eliminar"],
  },
  {
    resource: "viabilidad",
    actions: ["ver", "ejecutar"],
  },
  {
    resource: "produccion",
    actions: ["ver", "editar"],
  },
  {
    resource: "despacho",
    actions: ["ver", "crear"],
  },
  {
    resource: "comercial",
    actions: ["ver", "cotizacion.crear", "cotizacion.aprobar"],
  },
];

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  administrador: ["*"],
  comercial: ["pedido.ver", "comercial.ver", "cotizacion.crear"],
  produccion: ["pedido.ver", "produccion.ver", "produccion.editar"],
  operador: ["pedido.ver", "produccion.ver"],
  supervisor: [
    "pedido.ver",
    "pedido.editar",
    "produccion.ver",
    "produccion.editar",
  ],
  viabilidad: ["pedido.ver", "viabilidad.ver", "viabilidad.ejecutar"],
  despacho: ["pedido.ver", "despacho.ver", "despacho.crear"],
};

type AdminTab = "usuarios" | "roles" | "permisos";

export function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("usuarios");

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: adminApi.usuarios,
  });

  if (isLoading) {
    return <LoadingState message="Cargando administración..." />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Administración"
        description="Usuarios, roles y permisos"
        breadcrumb={[
          { label: "Inicio", href: "/" },
          { label: "Administración", href: "/admin" },
        ]}
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          {
            value: "usuarios",
            label: "Usuarios",
            count: usuarios.length,
          },
          {
            value: "roles",
            label: "Roles",
          },
          {
            value: "permisos",
            label: "Permisos",
          },
        ]}
      />

      {tab === "usuarios" && (
        <Card className="overflow-hidden p-2">
          <UsersPage />
        </Card>
      )}

      {tab === "roles" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
            <Card key={role}>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {ROLE_LABELS[role]}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {ROLE_PERMISSIONS[role].includes("*")
                        ? "Acceso total"
                        : `${ROLE_PERMISSIONS[role].length} permisos`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {ROLE_PERMISSIONS[role].includes("*") ? (
                    <Badge
                      className={[
                        "border-destructive/20",
                        "bg-destructive/10",
                        "text-destructive",
                      ].join(" ")}
                    >
                      Acceso total
                    </Badge>
                  ) : (
                    ROLE_PERMISSIONS[role].slice(0, 4).map((permission) => (
                      <Badge
                        key={permission}
                        className={[
                          "border-border",
                          "bg-muted",
                          "text-muted-foreground",
                        ].join(" ")}
                      >
                        {permission}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "permisos" && (
        <Card className="overflow-hidden">
          <Table hoverable>
            <TableHeader>
              <TableRow hoverable={false}>
                <TableHead>Recurso</TableHead>
                <TableHead>Acción</TableHead>

                {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                  <TableHead key={role} align="center">
                    {ROLE_LABELS[role]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {PERMISSIONS_MATRIX.map((permissionGroup) =>
                permissionGroup.actions.map((action) => {
                  const permission = `${permissionGroup.resource}.${action}`;

                  return (
                    <TableRow key={permission} hoverable>
                      <TableCell className="font-medium">
                        {permissionGroup.resource}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {action}
                      </TableCell>

                      {(Object.keys(ROLE_LABELS) as Role[]).map((role) => {
                        const hasPermission =
                          ROLE_PERMISSIONS[role].includes("*") ||
                          ROLE_PERMISSIONS[role].includes(permission);

                        return (
                          <TableCell key={role} align="center">
                            {hasPermission ? (
                              <CheckCircle2
                                className="mx-auto size-4 text-success"
                                aria-label="Permitido"
                              />
                            ) : (
                              <XCircle
                                className="mx-auto size-4 text-muted-foreground/30"
                                aria-label="No permitido"
                              />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                }),
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

export default AdminPage;
