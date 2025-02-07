// @ts-check
const { generateSchema, generateOutput } = require('@gql.tada/cli-utils');
const { join } = require('path');

const graphqlApiDomain = process.env.BIGCOMMERCE_GRAPHQL_API_DOMAIN ?? 'mybigcommerce.com';
const contentfulGraphqlApiDomain =
  process.env.CONTENTFUL_GRAPHQL_API_DOMAIN ?? 'graphql.contentful.com';
const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master';

const getStoreHash = () => {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;

  if (!storeHash) {
    throw new Error('Missing store hash');
  }

  return storeHash;
};

const getChannelId = () => {
  const channelId = process.env.BIGCOMMERCE_CHANNEL_ID;

  return channelId;
};

const getToken = () => {
  const token = process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN;

  if (!token) {
    throw new Error('Missing customer impersonation token');
  }

  return token;
};

const getEndpoint = () => {
  const storeHash = getStoreHash();
  const channelId = getChannelId();

  // Not all sites have the channel-specific canonical URL backfilled.
  // Wait till MSF-2643 is resolved before removing and simplifying the endpoint logic.
  if (!channelId || channelId === '1') {
    return `https://store-${storeHash}.${graphqlApiDomain}/graphql`;
  }

  return `https://store-${storeHash}-${channelId}.${graphqlApiDomain}/graphql`;
};

const getContentfulSpaceId = () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;

  if (!spaceId) {
    throw new Error('Missing Contentful space ID');
  }

  return spaceId;
};

const getContentfulAccessToken = () => {
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Missing Contentful access token');
  }

  return accessToken;
};

const getContentfulEndpoint = () => {
  const spaceId = getContentfulSpaceId();

  return `https://${contentfulGraphqlApiDomain}/content/v1/spaces/${spaceId}/environments/${contentfulEnvironment}`;
};

const generate = async () => {
  try {
    await generateSchema({
      input: getEndpoint(),
      headers: { Authorization: `Bearer ${getToken()}` },
      output: join(__dirname, '../bigcommerce.graphql'),
      tsconfig: undefined,
    });

    await generateSchema({
      input: getContentfulEndpoint(),
      headers: { Authorization: `Bearer ${getContentfulAccessToken()}` },
      output: join(__dirname, '../contentful.graphql'),
      tsconfig: undefined,
    });

    await generateOutput({
      disablePreprocessing: false,
      output: undefined,
      tsconfig: undefined,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

generate();
