import ical from 'ical-generator';

/**
 * class for ics file instance
 */
export function getIcsObjectInstance(
  start_time,
  end_time,
  summary,
  description,
  location,
  url,
  nameOrganizer,
  emailOrganizer,
) {
  const cal = ical({ name: summary });
  cal.createEvent({
    start: start_time, // eg : moment()
    end: end_time, // eg : moment(1,'days')
    summary: summary, // 'Summary of your event'
    description: description, // 'More description'
    location: location, // 'Delhi'
    url: url, // 'event url'
    organizer: {
      // 'organizer details'
      name: nameOrganizer,
      email: emailOrganizer,
    },
  });
  return cal;
}
