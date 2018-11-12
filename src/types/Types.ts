export interface BasicKeyValueObject {
  [key: string]: string
}

export interface BasicWebRequest {
  url: string;
  requestType: string; 
}

export type RawRequestBody = {
  error?: string
  formData?: { [key: string]: any }
  raw: Array<any>
}

export interface GetRequest extends BasicWebRequest {
  requestType: 'GET'
  requestParams: BasicKeyValueObject | {}
}

export interface PostRequest extends BasicWebRequest {
  requestType: 'POST'
  requestBody: RawRequestBody
}

export type RawWebRequestData = GetRequest | PostRequest;

export type FormattedWebRequestData = {
  meta: {
    title: string;
  };
  data: FormattedDataItem[];
};

export type Formatting = "string" | "json";

export type FormattedDataItem = {
  label: string;
  value: string;
  formatting: Formatting;
  category?: string | null;
};

export type Provider = {
  canonicalName: ProviderCanonicalName;
  displayName: string;
  logo: string;
  pattern: RegExp;
  transformer: (rwrd: RawWebRequestData) => FormattedWebRequestData;
};

export type ProviderCanonicalName =
  | "Snowplow"
  | "AdobeAnalyticsAppMeasurement"
  | "Nielsen"
  | "Mixpanel"
  | "Krux"
  | "Rubicon"
  | "GoogleAnalytics";

export type Version = string;

export type LabelDictionary = BasicKeyValueObject
