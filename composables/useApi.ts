import { useFetch } from "#app"

type useFetchType = typeof useFetch

export const useApi: useFetchType = (path, options = {}) => {
  options.baseURL = "http://localhost:1337"
  return useFetch(path, options)
}