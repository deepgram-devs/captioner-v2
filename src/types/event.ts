export type DGEvent = {
  id: string;
  title: string;
  slug?: string;
  key?: string;
  dg_project?: string;
  dg_key?: string;
  approval_status?: "approved" | "pending" | "rejected";
  start_date?: string;
  end_date?: string;
  total_days?: number;
  user_id: string;
  contact_email?: string;
  website?: string;
  description?: string;
  organizer_name?: string;
  country?: string;
  city?: string;
  state?: string;
  street_address?: string;
  zip_code?: string;
};
