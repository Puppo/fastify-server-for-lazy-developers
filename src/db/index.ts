
type Post = {
  id: number;
  title: string;
  content: string;
}

const posts: Post[] = [{
  id: 1,
  title: 'Hello World',
  content: 'This is my first post!',
}, {
  id: 2,
  title: 'Second Post',
  content: 'This is my second post!',
}];

export default {posts};
