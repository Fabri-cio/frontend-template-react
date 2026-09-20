import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  type DataTableColumn,
  type DataTableFilters,
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
  const location = useLocation();

  const { get, setMany } = useUrlQueryParams();

  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [showFilters, setShowFilters] = useState(false);

  const search = get("search") ?? "";

  const username = get("username") ?? "";
  const email = get("email") ?? "";
  const firstName = get("first_name") ?? "";
  const status = get("is_active") ?? "";

  const page = Number(get("page")) || 1;
  const pageSize = Number(get("page_size")) || 10;

  /**
   * URL exacta de la lista actual.
   *
   * Se utiliza como origen al navegar hacia crear o editar.
   * De esta forma se conservan todos los parámetros actuales.
   */
  const currentListUrl = `${location.pathname}${location.search}`;

  const filters = useMemo<DataTableFilters>(
    () => ({
      username,
      email,
      first_name: firstName,
      is_active: status,
    }),
    [username, email, firstName, status],
  );

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

    if (username.trim()) {
      nextParams.username = username.trim();
    }

    if (email.trim()) {
      nextParams.email = email.trim();
    }

    if (firstName.trim()) {
      nextParams.first_name = firstName.trim();
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
  }, [page, pageSize, search, username, email, firstName, status, sort]);

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
        filterable: true,
        filterType: "text",
      },
      {
        id: "email",
        header: "Correo",
        accessor: "email",
        sortable: true,
        filterable: true,
        filterType: "text",
      },
      {
        id: "first_name",
        header: "Nombre",
        cell: (user) => `${user.first_name} ${user.last_name}`.trim() || "—",
        sortable: true,
        filterable: true,
        filterType: "text",
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
        filterable: true,
        filterType: "select",
        filterOptions: [
          {
            value: "true",
            label: "Activo",
          },
          {
            value: "false",
            label: "Inactivo",
          },
        ],
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
            onClick={() =>
              navigate(`/users/${user.id}`, {
                state: {
                  from: currentListUrl,
                },
              })
            }
          >
            Editar
          </Button>
        ),
        align: "center",
      },
    ],
    [currentListUrl, navigate],
  );

  function handleSearchChange(value: string) {
    setMany({
      search: value.trim() || null,
      page: "1",
    });
  }

  function getStringFilter(
    value: DataTableFilters[string] | undefined,
  ): string {
    return typeof value === "string" ? value : "";
  }

  function handleFiltersChange(nextFilters: DataTableFilters) {
    const username = getStringFilter(nextFilters.username);
    const email = getStringFilter(nextFilters.email);
    const firstName = getStringFilter(nextFilters.first_name);
    const status = getStringFilter(nextFilters.is_active);

    setMany({
      username: username.trim() || null,
      email: email.trim() || null,
      first_name: firstName.trim() || null,
      is_active: status || null,
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
      <DataTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar usuarios..."
        showFilters={showFilters}
        onShowFiltersChange={setShowFilters}
      />

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
        showFilters={showFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
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
