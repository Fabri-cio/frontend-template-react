
import type { User } from "../types";

export const mockUsers: User[] = [
  { id: 'u1', name: 'Carlos Mendoza', email: 'carlos@inplaz.com', role: 'supervisor', permissions: ['*'], active: true, lastLogin: '2026-08-26T08:00:00' },
  { id: 'u2', name: 'María Quispe', email: 'maria@inplaz.com', role: 'comercial', permissions: ['*'], active: true, lastLogin: '2026-08-26T07:30:00' },
  { id: 'u3', name: 'Jorge Mamani', email: 'jorge@inplaz.com', role: 'produccion', permissions: ['*'], active: true, lastLogin: '2026-08-26T06:00:00' },
  { id: 'u4', name: 'Ana Rocha', email: 'ana@inplaz.com', role: 'viabilidad', permissions: ['*'], active: true, lastLogin: '2026-08-25T16:00:00' },
  { id: 'u5', name: 'Luis Fernández', email: 'luis@inplaz.com', role: 'despacho', permissions: ['*'], active: true, lastLogin: '2026-08-26T07:00:00' },
  { id: 'u6', name: 'Patricia Gómez', email: 'patricia@inplaz.com', role: 'operador', permissions: ['*'], active: true, lastLogin: '2026-08-26T05:30:00' },
  { id: 'u7', name: 'Roberto Silva', email: 'roberto@inplaz.com', role: 'administrador', permissions: ['*'], active: true, lastLogin: '2026-08-26T08:30:00' },
];