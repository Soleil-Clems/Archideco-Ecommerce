export interface Wishlist {
    id: number;
    id_products: number[];
    date_start: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    date_modification: {
      date: string;
      timezone_type: number;
      timezone: string;
    } | null;
  }
  
  export interface CreateWishlistBody {
    idProducts: number[];
  }
  
  export interface UpdateWishlistBody {
    idProducts: number[];
  }
  