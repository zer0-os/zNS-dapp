import { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { zodResolver } from '../../../lib/validation/zodResolver';
import ipfs from '../../../lib/ipfs';
import assert from 'assert';
interface SetImageProps {
  domain: string;
}

const schema = z
  .object({
    image: z
      .any()
      .transform(z.any(), (files: FileList) => files[0])
      .optional(),
    url: z.string().url().optional(),
  })
  .refine((obj) => 'url' in obj || (obj.image && obj.image.size > 0));

const SetImage: FC<SetImageProps> = ({ domain: _domain }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSetImageVisible, setIsSetImageVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain, refetchDomain } = domainContext;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [done, setDone] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const _setImage = useCallback(
    (imageUrl: string) => {
      if (
        account &&
        contracts.isJust() &&
        domain.isJust() &&
        account === domain.value.owner
      )
        contracts.value.registry
          .setImage(domain.value.id, imageUrl)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [account, contracts, domain, refetchDomain],
  );

  const uploadAndSetImage = useCallback(
    async (file: File) => {
      assert(domain.isJust());
      return ipfs
        .upload(domain.value.domain, file)
        .then(async (added) => _setImage('ipfs://' + added.hash))
        .then(() => refetchDomain());
    },
    [_setImage, domain, refetchDomain],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hideSetImage = useCallback(() => {
    setIsSetImageVisible(false);
  }, [setIsSetImageVisible]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showSetImage = useCallback(() => {
    setIsSetImageVisible(true);
  }, [setIsSetImageVisible]);

  if (domain.isNothing()) return null;

  return (
    <>
      {domain.isJust() && (
        <>
          {/* <img
            style={{ height: '10%', width: '10%' }}
            src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
          /> */}
          {/* <form
            onSubmit={handleSubmit(({ image, url }) =>
              url ? _setImage(url) : uploadAndSetImage(image),
            )}
          > */}
          <div className="create-button">
            <input
              className="fileInput"
              style={{}}
              name={'image'}
              type="file"
              ref={register}
            />
            <button
              className="img-btn"
              type="submit"
              onSubmit={handleSubmit(({ image, url }) =>
                url ? _setImage(url) : uploadAndSetImage(image),
              )}
            >
              SET IMAGE
            </button>
          </div>
          {/* </form> */}
        </>
      )}
    </>
  );
};
export default SetImage;
