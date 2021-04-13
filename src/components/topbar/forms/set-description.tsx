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
interface SetImageProps {
  domain: string;
}

const schema = z
  .object({
    description: z
      .any()
      .transform(z.any(), (files: FileList) => files[0])
      .optional(),
    url: z.string().url().optional(),
  })
  .refine((obj) => 'url' in obj || obj.description);

const SetStory: FC<SetImageProps> = ({ domain: _domain }) => {
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
  const _setStory = useCallback(
    (description: string) => {
      if (
        account &&
        contracts.isJust() &&
        name.isJust() &&
        account === name.value.owner
      )
        contracts.value.registry
          .setDomainMetadataUri(name.value.id, description)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [account, contracts, name, refetchDomain],
  );

  const SetStory = useCallback(
    async (file: File) => {
      assert(name.isJust());
      return ipfs
        .upload(name.value.metadata, file)
        .then(async (added) => _setStory('ipfs://' + added.hash))
        .then(() => refetchDomain());
    },
    [_setStory, name, refetchDomain],
  );

  if (name.isNothing()) return null;

  return (
    <>
      {true && (
        <>
          <img
            style={{ height: '10%', width: '10%' }}
            src={name.value.metadata.replace(
              'ipfs://',
              'https://ipfs.io/ipfs/',
            )}
          />
          <form
            onSubmit={handleSubmit(({ description, url }) =>
              url ? _setStory(url) : SetStory(description),
            )}
          >
            <div className="create-button">
              <input style={{}} name={'image'} type="file" ref={register} />
              <button
                className="img-btn"
                type="submit"
                onSubmit={handleSubmit(({ description, url }) =>
                  url ? _setStory(url) : SetStory(description),
                )}
              >
                save story
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};
export default SetStory;
