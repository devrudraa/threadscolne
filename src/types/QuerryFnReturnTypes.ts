export interface MainPageThreadType {
  id: string;
  parentId: string | null;
  text: string;
  author: {
    name: string;
    image: string;
    id: string;
    username?: string | null;
  };
  createdAt: string;
  username: string;
  children?: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  isDedicatedPage: boolean;
  image: string | null;
  imageDesc: string | null;
}
