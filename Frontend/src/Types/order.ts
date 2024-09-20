export interface Order {
    id: number;
    reception_date: string | null;
    order_date: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    status: string;
    user: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
    };
    cart: {
      id: number;
      products: number[];
    };
  }
  
  export interface CreateOrderBody {
    idCart: number;
  }
  