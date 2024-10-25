import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ['https://dev-indexer.tonco.io/'],
  documents: 'src/graphql/queries/!(*.d).{ts,tsx}',
  generates: {
    'src/graphql/generated/graphql.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withResultType: true,
      },
    },
  },
};

export default config;
