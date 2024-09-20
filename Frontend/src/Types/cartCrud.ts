export interface Cart {
    id: number;
    id_user: number;
    id_products: number[];
    date_start: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
  }
  
  export interface CreateCartBody {
    idProducts: number[];
  }
  