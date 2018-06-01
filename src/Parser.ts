import * as querystring from "querystring";
import { defaultTo, map, toPairs } from "ramda";
import { parse as UrlParse } from "url";
import { FormattedDataItem, RawWebRequestData, GetRequest, BasicKeyValueObject } from "./types/Types";

export const createFormattedDataFromGet = (requestParams: BasicKeyValueObject): FormattedDataItem[] => {
  return map(createWebRequestParam, toPairs(requestParams));
}

const createWebRequestParam = (tuple: [string, string]): FormattedDataItem => {
  return { label: tuple[0], value: tuple[1], formatting: "string" };
};
