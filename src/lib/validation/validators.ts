const subdomainRegex = /^[a-z0-9]+$/g;

const subdomainValidator = (v: string) => {
  if (subdomainRegex.test(v)) {
    return "all domains must be lower case";
  }
  return undefined
};

export { subdomainValidator };
