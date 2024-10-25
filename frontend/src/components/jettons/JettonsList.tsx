import { useJettonsQuery } from 'src/graphql/generated/graphql';
import { isDefined } from 'src/utils/common/isDefined';
import JettonsTable from '../common/Table/jettonsTable';
import { jettonsColumns } from '../common/Table/jettonsColumns';

function JettonsList() {
  const { data, loading } = useJettonsQuery();

  const formattedJettons = data?.jettons
    ? data.jettons
        ?.map((jetton) => {
          if (!jetton) return undefined;

          const id = jetton.address;
          const name = jetton.name;
          const symbol = jetton.symbol;
          const decimals = jetton.decimals;
          const price = jetton.derivedTon;
          const volume = jetton.volumeUsd;
          const tvl = jetton.totalValueLockedUsd;
          const change = 0; // TODO;

          return {
            id,
            name,
            symbol,
            decimals,
            price,
            volume,
            tvl,
            change,
          };
        })
        .filter(isDefined)
    : [];

  return (
    <div className="flex w-full flex-col gap-4">
      <JettonsTable
        columns={jettonsColumns}
        data={formattedJettons}
        defaultSortingID={'price'}
        link={'explore/jettons'}
        showPagination
        loading={loading}
        searchID={'id'}
      />
    </div>
  );
}

export default JettonsList;
