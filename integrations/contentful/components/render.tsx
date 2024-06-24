import { contentfulFetch } from '../client';
import { contentfulGraphql, ResultOf } from '../graphql';

const HeroBannerBlockFragment = contentfulGraphql(`
  fragment HeroBannerBlockFragment on HeroBanner {
    sys { id }
    title
    bannerDescription
    backgroundColor
    textColor
  }
`);

type HeroBanner = ResultOf<typeof HeroBannerBlockFragment>;

function HeroBanner({ bannerDescription, title, backgroundColor, textColor }: HeroBanner) {
  return (
    <div
      className="p-4"
      style={{ backgroundColor: backgroundColor ?? 'white', color: textColor ?? 'black' }}
    >
      <h2 className="text-3xl font-bold">{title}</h2>
      <p>{bannerDescription}</p>
    </div>
  );
}

const SectionBlockFragment = contentfulGraphql(`
  fragment SectionBlockFragment on SectionBlock {
    sys { id }
    title
    description
  }
`);

type SectionBlock = ResultOf<typeof SectionBlockFragment>;

function SectionBlock({ title, description }: SectionBlock) {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p>{description}</p>
    </div>
  );
}

const BlockSectionWithCardsFragment = contentfulGraphql(`
  fragment BlockSectionWithCardsFragment on BlockSectionWithCards {
    sys { id }
    title
    description
  }
`);

type BlockSectionWithCards = ResultOf<typeof BlockSectionWithCardsFragment>;

function BlockSectionWithCards({ title, description }: BlockSectionWithCards) {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p>{description}</p>
    </div>
  );
}

const GetWebpageQuery = contentfulGraphql(
  `
  query getWebpageBlocks {
    webpage(id: "J3CLLhyZATEY4jndbmaXZ") {
      pageBlocksCollection {
        items {
          __typename

          ...HeroBannerBlockFragment
          ...SectionBlockFragment
          ...BlockSectionWithCardsFragment
        } 
      }
    }
  }
`,
  [HeroBannerBlockFragment, SectionBlockFragment, BlockSectionWithCardsFragment],
);

export async function Render() {
  const { data } = await contentfulFetch({ document: GetWebpageQuery });

  if (!data.webpage) {
    return null;
  }

  if (!data.webpage.pageBlocksCollection) {
    return null;
  }

  const pageBlocks = data.webpage.pageBlocksCollection.items;

  return pageBlocks.map((block) => {
    if (!block) {
      return null;
    }

    switch (block.__typename) {
      case 'HeroBanner':
        return <HeroBanner key={block.sys.id} {...block} />;

      case 'SectionBlock':
        return <SectionBlock key={block.sys.id} {...block} />;

      case 'BlockSectionWithCards':
        return <BlockSectionWithCards key={block.sys.id} {...block} />;

      default:
        return null;
    }
  });
}
