import React, { FC } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import Transfer from './transferDomains';
import Create from './create';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import MUIDataTable from 'mui-datatables';

interface SubdomainsProps {
  domain: string;
}

interface RowProps {
  id: number;
  domain: string;
}

const Subdomains: FC<SubdomainsProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  if (domain.isNothing()) return <p>Loading</p>;

  const columns = ['Domain'];

  const data = domain.value.children.map((child, i) => [child.toString()]);

  // const handleRowClick: FC<RowProps> = ({row: _row}) => {
  //   this.props.history.push(`/${_row}`)
  // }

  const options = {
    onRowClick: (rowData: any) => console.log(rowData),
  };

  return (
    <div id="subdomainsContainer">
      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          <Create domainId={domain.value.id} domainContext={domainContext} />
          <Transfer domainId={domain.value.id} domainContext={domainContext} />
        </>
      ) : null}
      <div id="domainContainer">
        <Link to={'/' + domain.value.domain.replace(/\./, '/')}>
          Domain: {domain.value.domain}
        </Link>
        {/* old subdomains code */}
        {/* <div>
          Children:
          {domain.value.children.map((child) => (
            <div key={child}>
              <Link to={'/' + child.replace(/\./, '/')}>{child}</Link>
            </div>
          ))}
        </div> */}
        <div>Owner: {domain.value.owner}</div>
        <div style={{ minHeight: '500px', minWidth: '500px' }}>
          {' '}
          <MUIDataTable
            title={'Domains'}
            columns={columns}
            data={data}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default Subdomains;
