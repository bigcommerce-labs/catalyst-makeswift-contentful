import { contentfulFetch } from '~/integrations/contentful/client';
import { contentfulGraphql } from '~/integrations/contentful/graphql';

export async function GET() {
  const GET_POSTS = contentfulGraphql(`
    query getPostsCollection {
      postsCollection {
        total
        items {
          title
        }
      }
    }
  `);

  const {
    data: { postsCollection },
  } = await contentfulFetch({ document: GET_POSTS });

  if (!postsCollection) {
    return [];
  }

  return Response.json({ items: postsCollection.items });
}
