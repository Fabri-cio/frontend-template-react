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

import { useUsers } from "./users.hooks";
import type { User, UserListParams } from "./users.types";

/**
 * Página genérica de gestión de usuarios.
 *
 * Consume los componentes reutilizables de DataTable
 * y conecta la tabla con los hooks específicos de la feature.
 */
export default function UsersPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);

  const params = useMemo<UserListParams>(() => {
    const nextParams: UserListParams = {
      page,
      page_size: pageSize,
    };

    if (search.trim()) {
      nextParams.search = search.trim();
    }

    if (status === "active") {
      nextParams.is_active = true;
    }

    if (status === "inactive") {
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
        id: "is_active", // id unico de la columna
        header: "Estado", // nombre de la columna
        cell: (user) => // retorna un badge dependiendo si el usuario esta activo o inactivo
          user.is_active ? (
            <Badge variant="success">Activo</Badge>
          ) : (
            <Badge variant="secondary">Inactivo</Badge>
          ),
        sortable: true, // significa que se puede ordenar por este campo
        align: "center", // significa que se alinea al centro
      },
      {
        id: "date_joined",
        header: "Fecha de registro",
        cell: (user) => new Date(user.date_joined).toLocaleDateString(),
        sortable: true,
      },
    ],
    [],
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handlePageSizeChange(value: number) {
    setPageSize(value);
    setPage(1);
  }

  function handleSortChange(value: DataTableSort | null) {
    setSort(value);
    setPage(1);
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
              value: "active",
              label: "Activos",
            },
            {
              value: "inactive",
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
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
