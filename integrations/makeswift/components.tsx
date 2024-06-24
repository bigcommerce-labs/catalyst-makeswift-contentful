import { Combobox } from '@makeswift/runtime/controls';
import { forwardRef } from 'react';

import { runtime } from './runtime';

interface Props {
  title?: string;
}

interface Posts {
  items: Array<{
    title: string | null;
  } | null>;
}

async function fetchPosts() {
  const response = await fetch('/api/contentful/posts');
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const { items } = (await response.json()) as Posts;

  return items;
}

const Posts = forwardRef<HTMLParagraphElement, Props>((props, ref) => {
  return (
    <p ref={ref} {...props}>
      Placeholder for Contentful Posts
    </p>
  );
});

runtime.registerComponent(Posts, {
  type: 'contentful-posts',
  label: 'Contentful/Posts',
  props: {
    post: Combobox({
      label: 'Post Title',
      async getOptions() {
        const posts = await fetchPosts();

        return posts.map((post) => {
          if (!post) {
            return { id: 'id', label: 'No posts found', value: 'No posts found' };
          }

          return { id: post.title ?? '', label: post.title ?? '', value: post.title ?? '' };
        });
      },
    }),
  },
});
