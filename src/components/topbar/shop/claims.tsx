import React, { useCallback, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../../../lib/contracts';
// import { Domain, zeroAddress } from '../../../lib/useDomainStore';
// import { useDomainCache } from '../../../lib/useDomainCache';
import { Table } from 'antd';
import Profile from '../../table/table/table-image';

// const { Column } = Table;

// // // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // interface NFRowProps {
// //   id: number;
// //   domain: string;
// // }
// // // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // interface NFColumnProps {
// //   key: number;
// //   name: string;
// // }

// interface NfData {
//   Image: any;
//   NFT: any;
//   Owner: any;
//   Offer: any;
//   Date: string;
// }

// const Claims: React.FC = () => {
//   const context = useWeb3React<Web3Provider>();
//   const { account } = context;
//   const contracts = useZnsContracts();
//   const domainStore = useDomainCache();
//   const {
//     incomingApprovals,
//     refetchIncomingApprovals,
//     refetchOwned,
//   } = domainStore;

//   const _claim = useCallback(
//     (domain: Domain) => {
//       if (account && contracts.isJust())
//         contracts.value.registry
//           .transferFrom(domain.owner, account, domain.id)
//           .then((txr: any) => txr.wait(2))
//           .then(() => {
//             refetchIncomingApprovals();
//             refetchOwned();
//           });
//     },
//     [contracts, account, refetchOwned, refetchIncomingApprovals],
//   );

//   const _revoke = useCallback(
//     (domain: Domain) => {
//       if (account && contracts.isJust())
//         contracts.value.registry
//           .approve(zeroAddress, domain.id)
//           .then((txr: any) => txr.wait(2))
//           .then(() => {
//             refetchOwned();
//           });
//     },
//     [contracts, account, refetchOwned],
//   );

//   const dataInput: NfData[] = useMemo(
//     () =>
//       incomingApprovals.isNothing()
//         ? []
//         : incomingApprovals.value.map((domain) => ({
//             Image: (
//               <div className="imgContainer">
//                 <Profile domain={domain.domain} />
//               </div>
//             ),
//             NFT: domain.domain,
//             Owner: (
//               <div className="ownerCol">
//                 <div className="ownerIcon">img</div>
//                 {/* <div>{domain.owner}</div> */}
//                 <div>Artist Name</div>
//               </div>
//             ),
//             Offer: (
//               <div>
//                 <div>$1234.56</div>
//                 <div>(Ξ2.0476)</div>
//               </div>
//             ),
//             Date: '1 Sept 2020',
//           })),
//     [incomingApprovals],
//   );

//   // const claimBtn = () => {
//   //   if (incomingApprovals.isJust()) return incomingApprovals.value.map((domain) => (
//   //     <button onClick={() => _claim(domain)} key={domain.domain}>
//   //       {' '}
//   //       Claim Domain
//   //     </button>
//   //   ))}
//   // }

//   if (incomingApprovals.isNothing()) return null;
//   return (
//     <>
//       {/* <div className="create-button">
//         {incomingApprovals.value.map((domain) => (
//           <button onClick={() => _claim(domain)} key={domain.domain}>
//             {' '}
//             Claim Domain
//           </button>
//         ))}
//       </div> */}
//       <div>
//         <Table dataSource={dataInput} style={{ backgroundImage: 'none' }}>
//           <Column title="NFT" dataIndex="Image" key="Image" />
//           <Column title="" dataIndex="NFT" key="NFT" />
//           <Column title="Owner" dataIndex="Owner" key="Owner" />

//           <Column title="Offer" dataIndex="Offer" key="Offer" />
//           <Column title="Date" dataIndex="Date" key="Date" />
//           <Column
//             width="130px"
//             title={null}
//             key="action"
//             render={(domain: Domain) => (
//               <div
//                 className="claimsBtn"
//                 onClick={() => _claim(domain)}
//                 key={domain.domain}
//               >
//                 {' '}
//                 Claim
//               </div>
//             )}
//           />
//           <Column
//             width="130px"
//             title={null}
//             key="action"
//             render={(domain: Domain) => (
//               <div
//                 className="claimsBtn"
//                 onClick={() => _revoke(domain)}
//                 key={domain.domain}
//               >
//                 {' '}
//                 Revoke
//               </div>
//             )}
//           />
//         </Table>
//       </div>
//     </>
//   );
// };

// export default Claims;
