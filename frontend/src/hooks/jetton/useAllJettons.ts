import { useAllJettonsQuery } from 'src/graphql/generated/graphql';

export function useAllJettons() {
  const { data, loading } = useAllJettonsQuery();

  console.log(data, loading);

  return data;
}
