import { loadNodeIcon } from "@iconify/utils/lib/loader/node-loader"

export const iconFailible = async (path: string): Promise<string | undefined> => {
  const [collection, icon] = path.split(':', 2)
  if (icon === undefined || icon.length == 0) {
    throw SyntaxError(`Icon path could not be parsed '${path}'`)
  }

  return (await loadNodeIcon(/* @vite-ignore */collection, icon))
}

export const icon = async (path: string) => {
  const ic = await iconFailible(path)
  
  if (ic === undefined) {
    throw SyntaxError(`Icon path could not be resolved '${path}'`)
  } else if (ic === null) {
    throw Error(`Icon not found for ${path}`)
  }

  return ic as string
}