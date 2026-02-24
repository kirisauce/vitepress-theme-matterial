import { defineLoader } from "vitepress"
import { checkPostFrontMatterNoIndex, getBaseDirectory, loadPostData } from "../node/post-data-loader"
import path from "node:path"
import { PostData } from "../shared"


const load = async (files: string[]): Promise<PostData[]> => {
  const baseDirectory = getBaseDirectory()
  let result = new Array()

  for (const file of files) {
    const postData = await loadPostData(file, baseDirectory)
    if (checkPostFrontMatterNoIndex(postData))
      continue

    result.push(postData)
  }

  return result
}

export declare const data: PostData[]

export default defineLoader({
  watch: [path.resolve(getBaseDirectory(), "**/*.md")],
  load,
})
