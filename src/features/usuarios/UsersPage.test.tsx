import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UsersPage from "./UsersPage";

const mockUseUsers = vi.fn();

vi.mock("./users.hooks", () => ({
  useUsers: (...args: unknown[]) => mockUseUsers(...args),
}));

function renderUsersPage(initialEntry = "/users") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const usersResponse = {
  count: 25,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      username: "juan",
      email: "juan@example.com",
      first_name: "Juan",
      last_name: "Pérez",
      is_active: true,
      last_login: null,
      date_joined: "2026-01-01T10:00:00Z",
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();

  mockUseUsers.mockReturnValue({
    data: usersResponse,
    isLoading: false,
    isError: false,
    error: null,
  });
});

describe("UsersPage", () => {
  it("usa los valores por defecto cuando la URL no tiene parámetros", () => {
    renderUsersPage();

    expect(mockUseUsers).toHaveBeenCalledWith({
      page: 1,
      page_size: 10,
    });
  });

  it("lee la paginación desde la URL", () => {
    renderUsersPage("/users?page=2&page_size=25");

    expect(mockUseUsers).toHaveBeenCalledWith({
      page: 2,
      page_size: 25,
    });
  });

  it("lee la búsqueda desde la URL", () => {
    renderUsersPage("/users?search=juan");

    expect(mockUseUsers).toHaveBeenCalledWith({
      page: 1,
      page_size: 10,
      search: "juan",
    });
  });

  it("lee el filtro de estado activo desde la URL", () => {
    renderUsersPage("/users?is_active=true");

    expect(mockUseUsers).toHaveBeenCalledWith({
      page: 1,
      page_size: 10,
      is_active: true,
    });
  });

  it("lee el filtro de estado inactivo desde la URL", () => {
    renderUsersPage("/users?is_active=false");

    expect(mockUseUsers).toHaveBeenCalledWith({
      page: 1,
      page_size: 10,
      is_active: false,
    });
  });

  it("lee el ordenamiento ascendente desde la URL", () => {
    renderUsersPage("/users?ordering=email");

    expect(mockUseUsers).toHaveBeenCalledWith({
      page: 1,
      page_size: 10,
      ordering: "email",
    });
  });

  it("lee el ordenamiento descendente desde la URL", () => {
    renderUsersPage("/users?ordering=-email");

    expect(mockUseUsers).toHaveBeenCalledWith({
      page: 1,
      page_size: 10,
      ordering: "-email",
    });
  });

  it("actualiza la búsqueda y vuelve a la primera página", async () => {
    const user = userEvent.setup();

    renderUsersPage("/users?page=3&page_size=25");

    const searchInput = screen.getByPlaceholderText("Buscar usuarios...");

    await user.type(searchInput, "juan");

    await waitFor(() => {
      expect(mockUseUsers).toHaveBeenLastCalledWith({
        page: 1,
        page_size: 25,
        search: "juan",
      });
    });
  });

  it("actualiza el filtro de estado y vuelve a la primera página", async () => {
    const user = userEvent.setup();

    renderUsersPage("/users?page=3&search=juan");

    const filter = screen.getByLabelText("Estado");

    await user.selectOptions(filter, "false");

    await waitFor(() => {
      expect(mockUseUsers).toHaveBeenLastCalledWith({
        page: 1,
        page_size: 10,
        search: "juan",
        is_active: false,
      });
    });
  });

  it("actualiza el tamaño de página y vuelve a la primera página", async () => {
    const user = userEvent.setup();

    renderUsersPage("/users?page=3");

    const pageSizeSelect = screen.getByLabelText("Filas por página");

    await user.selectOptions(pageSizeSelect, "25");

    await waitFor(() => {
      expect(mockUseUsers).toHaveBeenLastCalledWith({
        page: 1,
        page_size: 25,
      });
    });
  });

  it("mantiene la búsqueda y cambia la página", async () => {
    const user = userEvent.setup();

    renderUsersPage("/users?search=juan&page=1");

    const nextPageButton = screen.getByRole("button", {
      name: /siguiente/i,
    });

    await user.click(nextPageButton);

    await waitFor(() => {
      expect(mockUseUsers).toHaveBeenLastCalledWith({
        page: 2,
        page_size: 10,
        search: "juan",
      });
    });
  });
});
