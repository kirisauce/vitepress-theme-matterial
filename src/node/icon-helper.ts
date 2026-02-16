import { loadNodeIcon } from "@iconify/utils/lib/loader/node-loader"

export const iconNoThrow = async (path: string) => {
  const [collection, icon] = path.split(':', 2)
  if (icon === undefined || icon.length == 0) {
    return undefined
  }

  return (await loadNodeIcon(/* @vite-ignore */collection, icon)) || null
}

export const icon = async (path: string) => {
  const ic = await iconNoThrow(path)
  
  if (ic === undefined) {
    throw SyntaxError(`Icon path could not be resolved '${path}'`)
  } else if (ic === null) {
    throw Error(`Icon not found for ${path}`)
  }

  return ic as string
}