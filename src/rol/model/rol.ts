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
        edit: true,
      },
      community: {
        view: true,
        create: true,
        edit: true,
      },
      formularios: {
        view: true,
        create: true,
        edit: true,
      },
      help_desk: {
        view: true,
        create: true,
        edit: true,
      },
      sites_and_services: {
        view: true,
        create: true,
        edit: true,
      },
      announcements: {
        view: true,
        challenges: true,
        create: true,
        edit: true,
      },
      events: {
        view: true,
        create: true,
        edit: true,
      },
      actas: {
        view: true,
        create: true,
        edit: true,
        close: true,
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
        edit: true,
      },
      community: {
        view: true,
        create: true,
        edit: true,
      },
      formularios: {
        view: true,
        create: true,
        edit: true,
      },
      help_desk: {
        view: true,
        create: true,
        edit: true,
      },
      sites_and_services: {
        view: true,
        create: true,
        edit: true,
      },
      announcements: {
        view: true,
        challenges: true,
        create: true,
        edit: true,
      },
      events: {
        view: true,
        create: true,
        edit: true,
      },
      actas: {
        view: true,
        create: true,
        edit: true,
        close: true,
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
        edit: true,
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
        edit: true,
      },
      actas: {
        view: true,
        create: true,
        edit: true,
        close: true,
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
        edit: true,
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
        edit: true,
      },
      actas: {
        view: true,
        create: true,
        edit: true,
        close: true,
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
