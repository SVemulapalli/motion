/**
 * @internal
 */
export type JSONObject = { [key: string]: JSONData }
/**
 * @internal
 */
export interface JSONArray extends Array<JSONData> {}
/**
 * @internal
 */
export type JSONData = null | string | number | boolean | JSONArray | JSONObject
