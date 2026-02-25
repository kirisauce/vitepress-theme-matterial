import { joinURL } from "../shared/utils"

export const fetchPage = async (prefix: string | URL, n: number, requestInit?: RequestInit): Promise<any> => {
  return fetch(joinURL([prefix, `${n}.json`]), requestInit)
    .then(response => response.json()) as Promise<any>
}