export const defaultRoles = [
  {
    type: 'superAdmin',
    name: 'Super Admin',
    permissions: [],
  },
  {
    type: 'admin',
    name: 'Administrador',
    permissions: [],
  },
  {
    type: 'host',
    name: 'Host',
    permissions: [],
  },
  {
    type: 'teamCoach',
    name: 'Team Coach',
    permissions: [],
  },
  {
    type: 'expert',
    name: 'Experto',
    permissions: [],
  },
  {
    type: 'user',
    name: 'Usuario',
    permissions: [],
  },
  {
    type: 'challenger',
    name: 'Challenger',
    permissions: [],
  },
];

export const listPermission = {
  // Startups
  view_startups: true,
  create_startups: true,
  edit_startups: true,

  // Experts
  view_experts: true,
  create_experts: true,
  edit_experts: true,

  // Entrepreneurs
  view_entrepreneurs: true,
  create_entrepreneurs: true,
  edit_entrepreneurs: true,

  // Business
  view_business: true,
  create_business: true,
  edit_business: true,

  // Tables
  download_all_tables: true,

  // Reports
  reports_view: true,
  reports_create: true,
  reports_edit: true,

  // Community
  community_view: true,
  community_create: true,
  community_edit: true,

  // Forms
  form_view: true,
  form_create: true,
  form_edit: true,

  // Help Desk
  help_desk_view: true,
  help_desk_create: true,
  help_desk_edit: true,

  // Sites
  sites_and_services_view: true,
  sites_and_services_create: true,
  sites_and_services_edit: true,

  // Announcements
  announcements_view: true,
  announcements_challenges: true,
  announcements_create: true,
  announcements_edit: true,

  // Phase and batch
  phases_view: true,
  phases_batch_create: true,
  phases_batch_access: true,
  phases_batch_edit: true,
  phases_batch_content: true,
  phases_phase_edit: true,

  // Phase Events
  events_view: true,
  events_create: true,
  events_edit: true,

  // Phase Actas
  actas_view: true,
  actas_create: true,
  actas_close: true,
  actas_edit: true,

  // Phase Hours bag
  hours_view: true,
  hours_edit_main: true,
  hours_edit_activities: true,
  hours_edit_startups: true,
  hours_edit_experts: true,
};
