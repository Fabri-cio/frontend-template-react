
export type ID = string;

export type Role =
  | "administrador"
  | "comercial"
  | "produccion"
  | "operador"
  | "supervisor"
  | "viabilidad"
  | "despacho";

  export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  permissions: string[];
  active: boolean;
  lastLogin?: string;
}