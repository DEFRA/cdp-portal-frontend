export const announcementStyleguide = {
  name: 'announcement',
  title: 'Announcement',
  description: 'System-wide announcement banner with multiple messages',
  category: 'display',
  macro: {
    path: 'announcement/macro.njk',
    name: 'appAnnouncement'
  },
  params: [
    {
      name: 'announcements',
      type: 'array',
      required: true,
      description: 'Array of announcement objects with text or html property'
    }
  ],
  examples: [
    {
      title: 'Text announcement',
      params: {
        announcements: [
          {
            text: 'The platform will be unavailable on Saturday from 2am-4am.'
          }
        ]
      }
    },
    {
      title: 'HTML announcement',
      params: {
        announcements: [
          {
            html: '<strong>Planned Maintenance:</strong> System updates scheduled for this weekend.'
          }
        ]
      }
    },
    {
      title: 'Multiple announcements',
      params: {
        announcements: [
          { text: 'Welcome to the Core Delivery Platform!' },
          {
            html: 'Read our <a href="/documentation" class="app-link">documentation</a> to get started.'
          }
        ]
      }
    }
  ]
}
