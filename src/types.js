// @flow

export type WebRequestData = {|
  meta?: {
    title: string
  },
  params: Array<WebRequestParam>
|};

export type WebRequestParam = {|
  label: string,
  value: string,
  valueType: "string" | "json",
  category?: string | null;
|};

export type Provider = {|
  canonicalName: ProviderCanonicalName,
  displayName: string,
  logo: string,
  pattern: RegExp,
  transformer: (WebRequestData) => WebRequestData
|};

export type ProviderCanonicalName = 'Snowplow' | 'AdobeAnalyticsAppMeasurement' | 'Nielsen' | 'Krux' | 'Rubicon';

export type Version = string;