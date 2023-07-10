export const defaultRoles = [
  {
    type: 'superAdmin',
    name: 'Super Admin',
    permissions: {
      view_startups: true,
      view_experts: true,
      view_entrepreneurs: true,
      view_business: true,
      download_tables: true,
      reports: {
        view: true,
        create: true,
      },
      community: {
        view: true,
        create: true,
      },
      formularios: {
        view: true,
        create: true,
      },
      help_desk: {
        view: true,
        create: true,
      },
      sites_and_services: {
        view: true,
        create: true,
      },
      announcements: {
        view: true,
        challenges: true,
        create: true,
      },
      events: {
        view: true,
        create: true,
      },
      actas: {
        view: true,
        create: true,
        close: true,
      },
      phases: {
        view: true,
        batch_edit: true,
        phase_edit: true,
      },
    },
  },
  {
    type: 'admin',
    name: 'Administrador',
    permissions: {
      view_startups: true,
      view_experts: true,
      view_entrepreneurs: true,
      view_business: true,
      download_tables: true,
      reports: {
        view: true,
        create: true,
      },
      community: {
        view: true,
        create: true,
      },
      formularios: {
        view: true,
        create: true,
      },
      help_desk: {
        view: true,
        create: true,
      },
      sites_and_services: {
        view: true,
        create: true,
      },
      announcements: {
        view: true,
        challenges: true,
        create: true,
      },
      events: {
        view: true,
        create: true,
      },
      actas: {
        view: true,
        create: true,

        close: true,
      },
      phases: {
        view: true,
        batch_edit: true,
        phase_edit: true,
      },
    },
  },
  {
    type: 'host',
    name: 'Host',
    permissions: {
      view_startups: true,
      view_experts: true,
      view_entrepreneurs: true,
      view_business: true,
      download_tables: true,
      reports: {
        view: true,
        create: true,
      },
      community: {
        view: false,
        create: false,
        edit: false,
      },
      formularios: {
        view: false,
        create: false,
        edit: false,
      },
      help_desk: {
        view: false,
        create: false,
        edit: false,
      },
      sites_and_services: {
        view: false,
        create: false,
        edit: false,
      },
      announcements: {
        view: false,
        challenges: false,
        create: false,
        edit: false,
      },
      events: {
        view: true,
        create: true,
      },
      actas: {
        view: true,
        create: true,

        close: true,
      },
      phases: {
        view: true,
        batch_edit: true,
        phase_edit: false,
      },
    },
  },
  {
    type: 'teamCoach',
    name: 'Team Coach',
    permissions: {
      view_startups: true,
      view_experts: true,
      view_entrepreneurs: true,
      view_business: true,
      download_tables: true,
      reports: {
        view: true,
        create: true,
      },
      community: {
        view: false,
        create: false,
        edit: false,
      },
      formularios: {
        view: false,
        create: false,
        edit: false,
      },
      help_desk: {
        view: false,
        create: false,
        edit: false,
      },
      sites_and_services: {
        view: false,
        create: false,
        edit: false,
      },
      announcements: {
        view: false,
        challenges: false,
        create: false,
        edit: false,
      },
      events: {
        view: true,
        create: true,
      },
      actas: {
        view: true,
        create: true,

        close: true,
      },
      phases: {
        view: true,
        batch_edit: true,
        phase_edit: false,
      },
    },
  },
  {
    type: 'expert',
    name: 'Experto',
    permissions: {},
  },
  {
    type: 'user',
    name: 'Usuario',
    permissions: {},
  },
  {
    type: 'challenger',
    name: 'Challenger',
    permissions: {},
  },
];
