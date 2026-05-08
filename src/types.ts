export interface NewsPost {
  id: number;
  title: string;
  perex: string;
  date: string;
  imagename: string;
}

export interface ApiResponse {
  category: {
    id: number;
    title: string;
  };
  posts: NewsPost[];
}
