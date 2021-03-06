import { contains, defaultTo, filter, find, isNil, join, map, path, values } from "ramda";
import * as Providers from "./providers";
import { Provider, ProviderCanonicalName } from "./types/Types";

export const lookup = (name: ProviderCanonicalName): Provider | null => {
  const provider = find(p => p.canonicalName === name, values(Providers));

  return isNil(provider) ? null : provider;
};

export const lookupByUrl = (url: string): Provider | null => {
  const getRegex = (p: Provider) => defaultTo(new RegExp(""), path(["pattern"], p)) as RegExp;
  const provider = find(p => !!url.match(getRegex(p)), values(Providers));

  return isNil(provider) ? null : provider;
};

export const matchesBroadly = (url: string, regexPattern: RegExp): boolean => {
  return !!url.match(regexPattern);
};

export const generateMasterPattern = (selectedProviders: ProviderCanonicalName[]): RegExp => {
  const filtered = filter((p: Provider) => contains(p.canonicalName, selectedProviders), values(Providers));

  const pattern = join("|", map(path(["pattern", "source"]), filtered));

  return new RegExp(pattern);
};
