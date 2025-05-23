/* eslint-disable prettier/prettier */
import { serverResponse, userType } from "@renderer/types/login";

export function isServerResponse(obj): obj is serverResponse<userType> {

  return (
    obj &&
    typeof obj === 'object' &&
    'status' in obj &&
    'data' in obj
  )
}
