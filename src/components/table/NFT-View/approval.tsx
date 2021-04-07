import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { getAddress } from '@ethersproject/address';
import * as z from 'zod';
import { zodResolver } from '../../../lib/validation/zodResolver';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../../../lib/contracts';
import { hexRegex } from '../../../lib/validation/validators';
// import { useDomainCache } from '../../../lib/useDomainCache';

// interface ApprovalProps {
//   domain: string;
// }

// const schema = z.object({
//   address: z
//     .string()
//     .regex(hexRegex, 'Address must be hex')
//     .refine(
//       (address) => {
//         try {
//           return address === getAddress(address);
//         } catch (e) {
//           return false;
//         }
//       },
//       {
//         message: 'Not checksummed address',
//       },
//     ),
// });

// const Approve: React.FC<ApprovalProps> = ({ domain: _domain }) => {
//   const context = useWeb3React<Web3Provider>();
//   const { account } = context;
//   const contracts = useZnsContracts();
//   const domainStore = useDomainCache();
//   // const { refetchIncomingApprovals, useDomain, refetchOwned } = domainStore;
//   const { domain, refetchDomain } = useDomain(_domain);
//   const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//   });

//   const _approve = useCallback(
//     (address: string) => {
//       if (
//         account &&
//         contracts.isJust() &&
//         domain.isJust() &&
//         account !== address &&
//         account === domain.value.owner
//       ) {
//         contracts.value.registry
//           .approve(address, domain.value.id)
//           .then((txr) => {
//             return txr.wait(2);
//           })
//           .then((txh) => {
//             if (txh.status === 2) {
//               alert('TX REJECTED');
//             } else {
//               alert('TX APPOVED');
//             }
//             Promise.all([
//               refetchIncomingApprovals,
//               refetchDomain,
//               refetchOwned,
//             ]);
//           })
//           .catch((e) => {
//             //console.log('error?', e);
//             alert('TX ERROR');
//           });
//       }
//     },
//     [
//       account,
//       contracts,
//       domain,
//       refetchIncomingApprovals,
//       refetchDomain,
//       refetchOwned,
//     ],
//   );

//   if (domain.isNothing() || domain.value.owner !== account) return null;
//   return (
//     <>
//       <form onSubmit={handleSubmit(({ address }) => _approve(address))}>
//         <div>
//           <div>ETHEREUM ADDRESS TO TRANSFER TO</div>
//           <button type="submit">Transfer</button>
//           <input name={'address'} ref={register} placeholder="address" />
//         </div>
//       </form>
//     </>
//   );
// };

// export default Approve;
