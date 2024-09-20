export interface Reduction {
    id: number;
    id_category: number;
    reduction: number;
    end_at: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    created_at: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
  }
  
  export interface CreateReductionBody {
    idCategory: number;
    reduction: number;
    end_at: string;
  }
  
  export interface UpdateReductionBody {
    reduction?: number;
    end_at?: string;
  }
  