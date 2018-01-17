export type WebRequestData = {
  meta: {
    title?: string;
    requestUrl: string;
  },
  params: WebRequestParam[]
};

export type WebRequestParam = {
  label: string,
  value: string,
  valueType: "string" | "json",
  category?: string | null;
};

export type Provider = {
  canonicalName: ProviderCanonicalName,
  displayName: string,
  logo: string,
  pattern: RegExp,
  transformer: (wrd: WebRequestData) => WebRequestData
};

export type ProviderCanonicalName = 'Snowplow' | 'AdobeAnalyticsAppMeasurement' | 'Nielsen' | 'Krux' | 'Rubicon' | 'GoogleAnalytics';

export type Version = string;

export type LabelDictionary = {
  [key: string]: string
}
