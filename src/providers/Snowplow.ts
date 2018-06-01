import { Provider, FormattedDataItem, FormattedWebRequestData, LabelDictionary, RawWebRequestData } from "../types/Types";
import { map, contains, pathOr, find, assoc, sortBy, prop, propEq, isNil, propOr } from "ramda";
import { labelReplacerFromDictionary, setTitle } from "../PrivateHelpers";
import when from "when-switch";
import { createFormattedDataFromGet } from "../Parser";

const EVENT_PAYLOAD = "Event Payload";
const EVENT = "Event";

const transformer = (rwrd: RawWebRequestData): FormattedWebRequestData => {
  const formatted: FormattedDataItem[] = parse(rwrd);
  const data: FormattedDataItem[] = sortBy(prop("label"), map(transform, formatted));
  return setTitle(getEventName(data), data);
};

export const Snowplow: Provider = {
  canonicalName: "Snowplow",
  displayName: "Snowplow",
  logo: "snowplow.png",
  pattern: /(\/i\?.*tv=js-\d)/,
  transformer: transformer,
};

const getEventName = (params: Array<FormattedDataItem>): string => {
  const unknownEvent = "Unknown Event";

  const row = getEventRow(params);
  if (isNil(row)) return unknownEvent;

  const eventType = prop("value", row);

  return when(eventType)
    .is("pv", "Page View")
    .is("ue", getTitleFromUePx(params))
    .is("pp", "Page Ping")
    .is("tr", "Ecommerce transaction")
    .is("ti", "Ecommerce transaction")
    .is("se", "Custom Structured Event")
    .else(unknownEvent);
};

const getEventRow = (params: FormattedDataItem[]): FormattedDataItem | undefined => {
  return find(e => propEq("label", EVENT, e), params);
};

const getTitleFromUePx = (params: Array<FormattedDataItem>): string => {
  try {
    const ue_px_row = find(e => propEq("label", EVENT_PAYLOAD, e), params);
    const json = JSON.parse(propOr({}, "value", ue_px_row));
    return pathOr("Unknown Event", ["data", "data", "event_name"], json);
  } catch (e) {
    console.debug("Unparseable ue_px row from: ", JSON.stringify(params, null, 4));
    return "Unparseable Event";
  }
};

const parse = (rwrd: RawWebRequestData): FormattedDataItem[] => {
  switch (rwrd.requestType) {
    case "GET":
      return createFormattedDataFromGet(rwrd.requestParams);
    case "POST":
      console.log(`POST support for ${Snowplow.canonicalName} is not implemented.`);
      return [];
    default:
      return [];
  }
};

const transform = (datum: FormattedDataItem): FormattedDataItem => {
  const category = categorize(datum.label);
  const label = labelReplacer(datum.label);

  if (contains(datum.label, ["cx", "ue_px"])) {
    const json = formattedJSON(datum.value);
    return { label, value: json, formatting: "json", category };
  } else {
    return { label, value: datum.value, formatting: datum.formatting, category };
  }
};

const formattedJSON = (data: string): string => {
  const payload = BinarytoAscii(data);
  let parsed;
  try {
    parsed = JSON.parse(payload);
  } catch (e) {
    parsed = {
      error: "Could not parse data",
      context: data,
    };
  }
  const json = JSON.stringify(parsed, null, 4);
  return json;
};

const BinarytoAscii = (data: string): string => {
  return Buffer.from(data, "base64").toString("ascii");
};

const DATA_LABEL = "Data";

const categorize = (label: string): string | null => {
  if (contains(label, ["cx", "ue_px"])) {
    return DATA_LABEL;
  } else {
    return null;
  }
};

const labelReplacer = (label: string): string => {
  return labelReplacerFromDictionary(label, LabelDictionary);
};

const LabelDictionary: LabelDictionary = {
  ue_px: EVENT_PAYLOAD,
  cx: "Context Payload",
  e: EVENT,
};
