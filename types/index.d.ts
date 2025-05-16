export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
}
declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
  }
}