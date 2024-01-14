
type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const posts: Post[] = [{
  id: 1,
  title: 'Hello World',
  content: 'This is my first post!',
  createdAt: new Date(),
  updatedAt: new Date(),
}, {
  id: 2,
  title: 'Second Post',
  content: 'This is my second post!',
  createdAt: new Date(),
  updatedAt: new Date(),
}];

export default {posts};
