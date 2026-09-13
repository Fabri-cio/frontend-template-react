import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  DataTableToolbarFilter,
  type DataTableColumn,
  type DataTableSort,
} from "../../components/ui";

import { useUrlQueryParams } from "../../hooks/use-url-query-params";
import { useUsers } from "./users.hooks";
import type { User, UserListParams } from "./users.types";

/**
 * Página de gestión de usuarios.
 *
 * El estado de búsqueda, filtros, paginación y ordenamiento
 * se mantiene en los parámetros de consulta de la URL.
 */
export default function UsersPage() {
  const navigate = useNavigate();
  const { get, setMany } = useUrlQueryParams();

  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);

  const search = get("search") ?? "";
  const status = get("is_active") ?? "";
  const page = Number(get("page")) || 1;
  const pageSize = Number(get("page_size")) || 10;

  const sort = useMemo<DataTableSort | null>(() => {
    const ordering = get("ordering");

    if (!ordering) {
      return null;
    }

    if (ordering.startsWith("-")) {
      return {
        id: ordering.slice(1),
        direction: "desc",
      };
    }

    return {
      id: ordering,
      direction: "asc",
    };
  }, [get]);

  const params = useMemo<UserListParams>(() => {
    const nextParams: UserListParams = {
      page,
      page_size: pageSize,
    };

    if (search.trim()) {
      nextParams.search = search.trim();
    }

    if (status === "true") {
      nextParams.is_active = true;
    }

    if (status === "false") {
      nextParams.is_active = false;
    }

    if (sort) {
      nextParams.ordering = sort.direction === "desc" ? `-${sort.id}` : sort.id;
    }

    return nextParams;
  }, [page, pageSize, search, status, sort]);

  const { data, isLoading, isError, error } = useUsers(params);

  const users = data?.results ?? [];
  const totalItems = data?.count ?? 0;

  const columns = useMemo<DataTableColumn<User>[]>(
    () => [
      {
        id: "username",
        header: "Usuario",
        accessor: "username",
        sortable: true,
      },
      {
        id: "email",
        header: "Correo",
        accessor: "email",
        sortable: true,
      },
      {
        id: "first_name",
        header: "Nombre",
        cell: (user) => `${user.first_name} ${user.last_name}`.trim() || "—",
        sortable: true,
      },
      {
        id: "is_active",
        header: "Estado",
        cell: (user) =>
          user.is_active ? (
            <Badge variant="success">Activo</Badge>
          ) : (
            <Badge variant="secondary">Inactivo</Badge>
          ),
        sortable: true,
        align: "center",
      },
      {
        id: "date_joined",
        header: "Fecha de registro",
        cell: (user) => new Date(user.date_joined).toLocaleDateString(),
        sortable: true,
      },
      {
        id: "actions",
        header: "Acciones",
        cell: (user) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/users/${user.id}`)}
          >
            Editar
          </Button>
        ),
        align: "center",
      },
    ],
    [navigate],
  );

  function handleSearchChange(value: string) {
    setMany({
      search: value.trim() || null,
      page: "1",
    });
  }

  function handleStatusChange(value: string) {
    setMany({
      is_active: value || null,
      page: "1",
    });
  }

  function handlePageChange(value: number) {
    setMany({
      page: String(value),
    });
  }

  function handlePageSizeChange(value: number) {
    setMany({
      page_size: String(value),
      page: "1",
    });
  }

  function handleSortChange(value: DataTableSort | null) {
    setMany({
      ordering: value
        ? value.direction === "desc"
          ? `-${value.id}`
          : value.id
        : null,
      page: "1",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Usuarios</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona los usuarios del sistema.
          </p>
        </div>

        <Button onClick={() => navigate("/users/new")}>Nuevo usuario</Button>
      </div>

      <DataTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar usuarios..."
      >
        <DataTableToolbarFilter
          value={status}
          onChange={handleStatusChange}
          options={[
            {
              value: "true",
              label: "Activos",
            },
            {
              value: "false",
              label: "Inactivos",
            },
          ]}
          label="Estado"
          placeholder="Todos"
        />
      </DataTableToolbar>

      {isError ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error instanceof Error
            ? error.message
            : "No se pudieron cargar los usuarios."}
        </div>
      ) : null}

      <DataTable
        data={users}
        columns={columns}
        getRowId={(user) => user.id}
        loading={isLoading}
        emptyMessage="No hay usuarios para mostrar."
        selectable
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        sort={sort}
        onSortChange={handleSortChange}
        striped
        hoverable
        stickyHeader
      />

      <DataTablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
