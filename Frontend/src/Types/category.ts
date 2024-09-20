export interface Category {
    id: number;
    title: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: string;
    weight: string;
    images: {
        [key: string]: Array<{
            hexa: string;
            color: string;
            image: string;
        }>
    };
    sizes: {
        hauteur: number;
        largeur: number;
        profondeur: number;
    };
}
