import { FC, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { zodResolver } from '../../../lib/validation/zodResolver';
import ipfs from '../../../lib/ipfs';
import assert from 'assert';
import ipfs_metadata from '../../../lib/metadata';
interface SetImageProps {
  name: string;
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

const SetImage: FC<SetImageProps> = ({ name: _domain }) => {
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isSetImageVisible, setIsSetImageVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();

  const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name, refetchDomain } = domainContext;

  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const _setImage = useCallback(
    (image: string) => {
      if (account && contracts.isJust() && name.isJust())
        contracts.value.registry
          .setDomainMetadataUri(name.value.id, image)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [account, contracts, name, refetchDomain],
  );

  // const uploadAndSetImage = useCallback(
  //   async (file: File) => {
  //     assert(name.isJust());
  //     return ipfs_metadata
  //       .upload(name.value.metadata, file)
  //       .then(async (added) => _setImage('ipfs://' + added.hash))
  //       .then(() => refetchDomain());
  //   },
  //   [_setImage, name, refetchDomain],
  // );

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const hideSetImage = useCallback(() => {
  //   setIsSetImageVisible(false);
  // }, [setIsSetImageVisible]);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const showSetImage = useCallback(() => {
  //   setIsSetImageVisible(true);
  // }, [setIsSetImageVisible]);

  if (name.isNothing()) return null;

  return (
    <>
      {/* {true && (
        <>
          <img
            style={{ height: '10%', width: '10%' }}
            src={name.value.metadata.replace(
              'ipfs://',
              'https://ipfs.io/ipfs/',
            )}
          />
          <form
            onSubmit={handleSubmit(({ image, url }) =>
              url ? _setImage(url) : uploadAndSetImage(image),
            )}
          >
            <div className="create-button">
              <input style={{}} name={'image'} type="file" ref={register} />
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
          </form>
        </>
      )} */}
    </>
  );
};
export default SetImage;
