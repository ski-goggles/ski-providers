import * as querystring from "querystring";
import { defaultTo, map, propOr, toPairs } from "ramda";
import { BasicKeyValueObject, FormattedDataItem, FormattedWebRequestData } from "./types/Types";

export const labelReplacerFromDictionary = (label: string, dictionary: BasicKeyValueObject): string => {
  return propOr(label, label, dictionary);
};

export const setTitle = (t: string | null, data: FormattedDataItem[]): FormattedWebRequestData => {
  const title = defaultTo("No Title", t) as string;
  return {
    meta: {
      title,
    },
    data,
  };
};

export const createFormattedDataFromObject = (obj: BasicKeyValueObject): FormattedDataItem[] => {
	return map(createWebRequestParam, toPairs(obj));
}

export const parseRawString = (str: string): BasicKeyValueObject => {
	return querystring.parse(str) as BasicKeyValueObject;
};

const createWebRequestParam = (tuple: [string, string]): FormattedDataItem => {
	return { label: tuple[0], value: tuple[1], formatting: "string" };
};
