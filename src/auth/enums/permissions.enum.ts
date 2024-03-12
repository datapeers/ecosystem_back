import { AuthUser } from '../types/auth-user';

/**
 * permission for accounts in app
 */
export enum Permission {
  // Startups
  view_startups = 'view_startups',
  load_all_startups = 'load_all_startups',
  create_startups = 'create_startups',
  edit_startups = 'edit_startups',

  // Experts
  view_experts = 'view_experts',
  create_experts = 'create_experts',
  edit_experts = 'edit_experts',

  // Entrepreneurs
  view_entrepreneurs = 'view_entrepreneurs',
  load_all_entrepreneurs = 'load_all_entrepreneurs',
  create_entrepreneurs = 'create_entrepreneurs',
  edit_entrepreneurs = 'edit_entrepreneurs',

  // Business
  view_business = 'view_business',
  create_business = 'create_business',
  edit_business = 'edit_business',

  // Tables
  download_all_tables = 'download_all_tables',

  // Reports
  reports_view = 'reports_view',
  reports_create = 'reports_create',
  reports_edit = 'reports_edit',

  // Community
  community_view = 'community_view',
  community_edit = 'community_edit',

  // Forms
  form_view = 'form_view',
  form_create = 'form_create',
  form_edit = 'form_edit',

  // Help Desk
  help_desk_view = 'help_desk_view',
  help_desk_create = 'help_desk_create',
  help_desk_edit = 'help_desk_edit',

  // Sites
  sites_and_services_view = 'sites_and_services_view',
  sites_and_services_create = 'sites_and_services_create',
  sites_and_services_edit = 'sites_and_services_edit',

  // Announcements
  announcements_view = 'announcements_view',
  announcements_challenges = 'announcements_challenges',
  announcements_edit_challenge = 'announcements_edit_challenge',
  announcements_create = 'announcements_create',
  announcements_edit = 'announcements_edit',

  // Phase and batch
  phases_batch_access = 'phases_batch_access',
  phases_phase_access = 'phases_phase_access',
  phases_phase_edit = 'phases_phase_edit',

  phases_batch_create = 'phases_batch_create',
  phases_batch_edit = 'phases_batch_edit',
  phases_batch_close = 'phases_batch_close',

  // Phase Events
  events_view = 'events_view',
  load_all_events = 'load_all_events',
  events_create = 'events_create',
  events_edit = 'events_edit',

  // Phase Actas
  actas_view = 'actas_view',
  actas_create = 'actas_create',
  actas_edit = 'actas_edit',
  actas_close = 'actas_close',

  // Phase Hours bag
  hours_view = 'hours_view',
  hours_edit_activities = 'hours_edit_activities',
  hours_edit_startups = 'hours_edit_startups',
  hours_edit_experts = 'hours_edit_experts',
  hours_edit_teamCoach = 'hours_edit_teamCoach',

  // Evaluations
  evaluation_view = 'evaluation_view',
  evaluation_create = 'evaluation_create',
  evaluation_edit = 'evaluation_edit',
  evaluation_edit_docs = 'evaluation_edit_docs',

  // Homeworks
  homeworks_view = 'homeworks_view',
  homeworks_evaluate = 'homeworks_evaluate',
}

/**
 * permission descriptions
 */
export const permissionDescriptions: Record<Permission, string> = {
  // Startups
  [Permission.view_startups]: 'Ver sección Startups',
  [Permission.load_all_startups]: 'Permitir que vea todas las startups',
  [Permission.create_startups]: 'Crear startup',
  [Permission.edit_startups]: 'Editar startup',

  // Experts
  [Permission.view_experts]: 'Ver sección expertos',
  [Permission.create_experts]: 'Crear experto',
  [Permission.edit_experts]: 'Editar expertos',

  // Entrepreneurs
  [Permission.view_entrepreneurs]: 'Ver sección empresarios',
  [Permission.load_all_entrepreneurs]: 'Permitir que vea todos los empresarios',
  [Permission.create_entrepreneurs]: 'Crear empresario',
  [Permission.edit_entrepreneurs]: 'Editar empresarios',

  // Business
  [Permission.view_business]: 'Ver sección empresas',
  [Permission.create_business]: 'Crear empresa',
  [Permission.edit_business]: 'Editar empresas',

  // Tables
  [Permission.download_all_tables]: 'Descargar información de tablas',

  // Reports
  [Permission.reports_view]: 'Ver sección reportes',
  [Permission.reports_create]: 'Crear reporte',
  [Permission.reports_edit]: 'Editar reporte',

  // Community
  [Permission.community_view]: 'Ver sección comunidad',
  [Permission.community_edit]: 'Editar visibilidad de comunidades',

  // Forms
  [Permission.form_view]: 'Ver sección formularios',
  [Permission.form_create]: 'Crear formulario',
  [Permission.form_edit]: 'Editar y borrar formularios',

  // Help Desk
  [Permission.help_desk_view]: 'Ver sección Mesa de ayuda',
  [Permission.help_desk_create]: 'Crear hilo en mesa de ayuda',
  [Permission.help_desk_edit]: 'Permitir editar un hilo en mesa de ayuda',

  // Sites
  [Permission.sites_and_services_view]: 'Ver sección Sedes y servicios',
  [Permission.sites_and_services_create]: 'Crear sede y servicios',
  [Permission.sites_and_services_edit]: 'Editar sede y servicios',

  // Announcements
  [Permission.announcements_view]: 'Ver sección convocatorias',
  [Permission.announcements_challenges]: 'Crear reto',
  [Permission.announcements_edit_challenge]: 'Editar reto',
  [Permission.announcements_create]: 'Crear convocatoria',
  [Permission.announcements_edit]: 'Editar convocatoria',

  // Phase and batch
  [Permission.phases_batch_access]: 'Ver sección fases',
  [Permission.phases_phase_access]: 'Ver configuración de fases base',
  [Permission.phases_phase_edit]: 'Permitir editar fase base',

  [Permission.phases_batch_create]: 'Crear batch',
  [Permission.phases_batch_edit]: 'Editar batch',
  [Permission.phases_batch_close]:
    'Puede cerrar un batch y asignar quienes pasan y quienes no',

  // Phase Events
  [Permission.events_view]: 'Ver sección eventos en los batch',
  [Permission.load_all_events]: 'Permitir que vea todos los eventos del batch',
  [Permission.events_create]: 'Crear evento',
  [Permission.events_edit]: 'Editar evento',

  // Phase Actas
  [Permission.actas_view]: 'Ver actas de los eventos',
  [Permission.actas_create]: 'Crear acta',
  [Permission.actas_edit]: 'Editar acta',
  [Permission.actas_close]: 'Cerrar acta',

  // Phase Hours bag
  [Permission.hours_view]: 'Ver sección bolsa de horas en batch',
  [Permission.hours_edit_activities]: 'Editar límite de horas por actividad',
  [Permission.hours_edit_startups]: 'Editar horas esperadas de los startups',
  [Permission.hours_edit_experts]: 'Editar horas necesarios de los experto',
  [Permission.hours_edit_teamCoach]:
    'Editar horas necesarios de los team coach',

  // Evaluations
  [Permission.evaluation_view]: 'Ver sección de evaluaciones en batch',
  [Permission.evaluation_create]:
    'Permitir crear una configuración para evaluaciones',
  [Permission.evaluation_edit]:
    'Permitir editar las configuraciones de una evaluación',
  [Permission.evaluation_edit_docs]:
    'Permitir evaluar en cualquiera de las evaluaciones',

  // Homeworks
  [Permission.homeworks_view]: 'Ver sección de tareas en batch',
  [Permission.homeworks_evaluate]:
    'Permitir evaluar las tareas de los participantes',
};

/**
 * get permission obj
 */
export const permissionDescription = (permission: Permission) => {
  return permissionDescriptions[permission];
};
/**
 * extract token from header
 */
export interface item_permission {
  label: string;
  key: Permission;
  activated: boolean;
}
/**
 * extract token from header
 */
export const list_of_permissions: item_permission[] = Object.entries(
  permissionDescriptions,
).map(([key, value]) => {
  return {
    label: value,
    key: key as Permission,
    activated: false,
  };
});
/**
 * extract token from header
 */
export function getPermissionList(user: AuthUser) {
  if (user.permissions && user.permissions.length !== 0) {
    return user.permissions;
  }
  return user.rolDoc.permissions;
}
