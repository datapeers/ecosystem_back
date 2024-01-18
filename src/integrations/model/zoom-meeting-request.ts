/**
 * @ignore
 */
export interface ZoomMeetingRequest {
  agenda: string;
  default_password: boolean;
  duration: number;
  password?: string;
  pre_schedule: boolean;
  recurrence?: Recurrence;
  schedule_for: string;
  settings: Settings;
  start_time: Date;
  template_id: string;
  timezone: string;
  topic: string;
  tracking_fields: TrackingField[];
  type: number;
}
/**
 * @ignore
 */
export interface Recurrence {
  end_date_time: Date;
  end_times: number;
  monthly_day: number;
  monthly_week: number;
  monthly_week_day: number;
  repeat_interval: number;
  type: number;
  weekly_days: string;
}
/**
 * @ignore
 */
export interface Settings {
  additional_data_center_regions?: string[];
  allow_multiple_devices: boolean;
  alternative_hosts: string;
  alternative_hosts_email_notification: boolean;
  approval_type: number;
  approved_or_denied_countries_or_regions?: ApprovedOrDeniedCountriesOrRegions;
  audio: string;
  audio_conference_info?: string;
  authentication_domains?: string;
  authentication_exception: AuthenticationException[];
  authentication_option?: string;
  auto_recording: string;
  breakout_room: BreakoutRoom;
  calendar_type: number;
  close_registration: boolean;
  contact_email: string;
  contact_name: string;
  email_notification: boolean;
  encryption_type: string;
  focus_mode: boolean;
  global_dial_in_countries?: string[];
  host_video: boolean;
  jbh_time: number;
  join_before_host: boolean;
  language_interpretation?: LanguageInterpretation;
  sign_language_interpretation?: SignLanguageInterpretation;
  meeting_authentication: boolean;
  meeting_invitees: MeetingInvitee[];
  mute_upon_entry: boolean;
  participant_video: boolean;
  private_meeting: boolean;
  registrants_confirmation_email: boolean;
  registrants_email_notification: boolean;
  registration_type: number;
  show_share_button: boolean;
  use_pmi: boolean;
  waiting_room: boolean;
  watermark: boolean;
  host_save_video_order: boolean;
  alternative_host_update_polls: boolean;
  internal_meeting: boolean;
  continuous_meeting_chat: ContinuousMeetingChat;
  participant_focused_meeting: boolean;
  push_change_to_calendar: boolean;
  resources: Resource[];
}
/**
 * @ignore
 */
export interface ApprovedOrDeniedCountriesOrRegions {
  approved_list: string[];
  denied_list: string[];
  enable: boolean;
  method: string;
}
/**
 * @ignore
 */
export interface AuthenticationException {
  email: string;
  name: string;
}
/**
 * @ignore
 */
export interface BreakoutRoom {
  enable: boolean;
  rooms: Room[];
}
/**
 * @ignore
 */
export interface Room {
  name: string;
  participants: string[];
}
/**
 * @ignore
 */
export interface ContinuousMeetingChat {
  enable: boolean;
  auto_add_invited_external_users: boolean;
}
/**
 * @ignore
 */
export interface LanguageInterpretation {
  enable: boolean;
  interpreters: LanguageInterpretationInterpreter[];
}
/**
 * @ignore
 */
export interface LanguageInterpretationInterpreter {
  email: string;
  languages: string;
}
/**
 * @ignore
 */
export interface MeetingInvitee {
  email: string;
}
/**
 * @ignore
 */
export interface Resource {
  resource_type: string;
  resource_id: string;
  permission_level: string;
}
/**
 * @ignore
 */
export interface SignLanguageInterpretation {
  enable: boolean;
  interpreters: SignLanguageInterpretationInterpreter[];
}
/**
 * @ignore
 */
export interface SignLanguageInterpretationInterpreter {
  email: string;
  sign_language: string;
}
/**
 * @ignore
 */
export interface TrackingField {
  field: string;
  value: string;
}
