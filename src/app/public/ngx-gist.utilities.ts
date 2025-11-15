import { getOrElse } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/function';
import * as io from 'io-ts';

/**
 * Validate that the value is a string.
 */
function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

/**
 * Validate that the value is a string that is non-empty.
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0 && value.trim().length > 0;
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

export function isNonEmptyValue<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * Decode by parsing json object of string value.
 */
export const parsedJsonFromStringCodec = new io.Type<unknown, string, string>(
  'ParsedJSONFromString',
  (potentiallyUnknownValue): potentiallyUnknownValue is unknown => true,
  (stringValue, context) => {
    try {
      return io.success(JSON.parse(stringValue));
    } catch {
      return io.failure(stringValue, context);
    }
  },
  (unknownValue) => JSON.stringify(unknownValue),
);

/**
 * Decode value using a passed codec and its' decoder.
 *
 * @param codec Codec used to decode value.
 *
 * @typeParam A - Static type (expected)
 * @typeParam O - Encode outputs of type
 * @typeParam I - Decode input of type
 *
 * @returns The decoeded value or null if an error occurs.
 */
export function decodeValueElseNull<A, I, O = unknown>(
  codec: io.Type<A, O, I>,
): (value: I) => A | null {
  return (value) =>
    pipe(
      codec.decode(value),
      getOrElse(() => null as A | null),
    );
}
