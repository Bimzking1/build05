export interface DataPost {
  id: string;
  content_text: string;
  media_urls: any;
  privacy: string;
  is_pinned: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  circle_id: string;
  play_id: string;
  quiz_id: string;
  hashtags: any;
  owner: Owner;
  pie_title: string;
  pie_amount: number;
  total_comment: number;
  total_polling: number;
  total_upvote: number;
  total_downvote: number;
  status_like: boolean;
  status_unlike: boolean;
  status_saved: boolean;
  parent_id: string;
  polling_date: string;
  polling_multiple: boolean;
  polling_new_option: boolean;
  slug: string;
  premium_fee: number;
  status_payment: boolean;
}

export interface Owner {
  avatar: string;
  label: string;
  name: string;
  username: string;
  verified: boolean;
}

export interface QrisDetail {
  admin_fee: number;
  id: string;
  is_active: boolean;
  is_priority: boolean;
  is_promo_available: boolean;
  logo_url: string;
  minimum_withdrawal: 0;
  payment_gateway: string;
  payment_method: string;
  payment_type: string;
  promo_price: number;
  service_fee: number;
}