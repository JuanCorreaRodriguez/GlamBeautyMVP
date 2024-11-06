export interface ModelBrand {
  name: '';
}
export interface ModelCart {
  amount: number;
  product: ModelProduct;
}
export interface ModelScheduleDay {
  day: string;
  open: string;
  close: string;
}
export interface ModelInfDialogData {
  title: string;
  message: string;
  cancel: string;
  continue: string;
}
export interface ModelSubcategories {
  name: [];
}
export interface ModelProduct {
  images: string[];
  videos: string[];
  name: string;
  desc: string;
  sku: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  brand: string;
  ranking: ModelRanking;
  subcategories: any[];
  dateTime: number;
  promo: string;
}
export interface ModelService {
  images: string[];
  videos: string[];
  sku: string;
  name: string;
  desc: string;
  type: string;
  dateTime: number;
  duration: string;
  price: number;
  promo: string;
  ranking: ModelRanking;
  author: string;
  subcategories: any[];
}
export interface ModelPromo {
  images: string[];
  videos: string[];
  from: number;
  to: number;
  name: string;
  desc: string;
  sku: string;
  discount: number;
  max: number;
  type: string;
  count: number;
  dateTime: number;
}
export interface ModelRanking {
  votes: number;
  rank: number[];
}
export interface ModelCategory {
  name: string;
  desc: string;
  id: string;
  image: string;
  subcategories: any[];
}
export interface ModelBussinesData {
  name: string;
  address: any[];
  brands: any[];
  phones: any[];
  schedules: any[];
  desc: string;
  sTyps: any[];
}
