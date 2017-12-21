import { ProviderCanonicalName, Provider } from "./types/Types";
import * as Providers from "./providers";
import { values, find, path, isNil, filter, contains, join, map } from "ramda";

export const lookup = (name: ProviderCanonicalName): Provider | null => {
  const provider = find(p => p.canonicalName === name, values(Providers));

  return isNil(provider) ? null : provider;
};

export const lookupByUrl = (url: string): Provider | null => {
  const provider = find(p => !!url.match(path(["pattern"], p)), values(Providers));

  return isNil(provider) ? null : provider;
};

export const matchesBroadly = (url: string, regexPattern: RegExp): boolean => {
  return !!url.match(regexPattern);
};

export const generateMasterPattern = (selectedProviders: ProviderCanonicalName[]): RegExp => {
  const filtered = filter((p: Provider) => contains(p.canonicalName, selectedProviders), values(Providers));

  let pattern = join("|", map(path(["pattern", "source"]), filtered));

  return new RegExp(pattern);
};
