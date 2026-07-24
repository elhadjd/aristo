/** Raw SISGESC Site API product/service payload (productsResource). */
export interface SisgescNamedEntity {
  id?: number | string;
  name?: string;
  nome?: string;
  slug?: string;
  title?: string;
  value?: string;
  description?: string;
  [key: string]: unknown;
}

export interface SisgescProduct {
  id: number | string;
  name?: string;
  nome?: string;
  description?: string | null;
  image?: string | null;
  reference?: string | null;
  code?: string | null;
  barr_code?: string | null;
  manufacturer?: string | null;
  product_page_link?: string | null;
  price?: number | string | null;
  cost?: number | string | null;
  price_out_iva?: number | string | null;
  tax?: number | string | null;
  state?: string | null;
  shop_online?: number | boolean | null;
  quantity?: number | null;
  inventory?: boolean | null;
  company_id?: number | null;
  category_product_id?: number | null;
  sub_category_id?: number | null;
  product_type_id?: number | null;
  product_type?: SisgescNamedEntity | string | null;
  category?: SisgescNamedEntity | null;
  features?: Array<string | SisgescNamedEntity> | null;
  requirements?: Array<string | SisgescNamedEntity> | null;
  benefits?: Array<string | SisgescNamedEntity> | null;
  catalog_product?: {
    media?: Array<{ url?: string; path?: string; image?: string }>;
  } | null;
  stars?: Array<{ rating?: number; comment?: string; name?: string }> | null;
  promotion_product?: unknown;
  quoted_price?: number | string | null;
  original_price?: number | string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface SisgescLaravelPaginated<T> {
  data: T[];
  links?: unknown;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

export interface SisgescSiteInfo {
  id?: number;
  name?: string;
  nome?: string;
  title?: string;
  description?: string;
  logo?: string;
  image?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  company_id?: number;
  [key: string]: unknown;
}

export interface SisgescCompanyInfo {
  id?: number;
  name?: string;
  nome?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  [key: string]: unknown;
}

export type SisgescPriceContext = {
  destination_state?: string;
  customer_reference?: string;
  customer_session?: string;
};
