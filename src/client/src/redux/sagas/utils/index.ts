export type Result<T, E extends Error = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
export type NoContentResult<E extends Error = Error> =
  | { success: true }
  | { success: false; error: E };
