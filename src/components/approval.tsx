// import React, { useCallback, } from "react";
// import { BigNumberish } from "ethers";
// import { useWeb3React } from "@web3-react/core";
// import { Web3Provider } from "@ethersproject/providers";
// import { useZnsContracts } from "../lib/contracts";
// import { useDomainCache } from "../lib/useDomainCache";

// interface ApprovalProps {
//   approvee: string;
//   domain_id: BigNumberish;
//   domain: string;
// }

// const Approve: React.FC<ApprovalProps> = ({
//   approvee: _approvee,
//   domain_id: _domain_id,
//   domain: _domain,
// }) => {
//   // const { register, handleSubmit } = useForm();
//   const context = useWeb3React<Web3Provider>();
//   const { account } = context;
//   const contracts = useZnsContracts();
//   const { useDomain } = useDomainCache();
//   const { domain, refetchDomain } = useDomain(_domain);
//   const { controlled } = useDomainCache();

//   const _approve = useCallback(() => {
//     if (account && contracts.isJust() && account != _approvee) {
//       contracts.value.registrar
//         .approve(_approvee, _domain_id)
//         .then((txr) => txr.wait(1))
//         .then(() => {
//           refetchDomain();
//         });
//     }
//   }, [contracts, account]);

//   if (
//     controlled.isNothing() ||
//     domain.isNothing() ||
//     domain.value.owner != account
//   )
//     return null;

//   return (
//     <>
//       <Form onSubmit={_approve} />
//     </>
//   );
// };

// export default Approve;

export {};
