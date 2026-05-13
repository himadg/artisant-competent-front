import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Routes protégées → CSR (pas de SSR nécessaire)
  { path: 'dashboard', renderMode: RenderMode.Client },
  { path: 'admin/professionals/**', renderMode: RenderMode.Client },
  { path: 'auth/**', renderMode: RenderMode.Client },
  // Pages publiques → SSR à la demande
  { path: '**', renderMode: RenderMode.Server },
];
