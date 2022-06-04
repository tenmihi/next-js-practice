import fs, { readFileSync } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostData() {
  const fileNames = fs.readdirSync(postsDirectory)

  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '')

    const fullPath = path.join(postsDirectory, fileName)
    const file = readFileSync(fullPath, 'utf-8')

    const matterResult = matter(file)

    return {
      id,
      ...matterResult.data,
    }
  })

  return allPostsData.sort((a, b) => {
    if (a < b) return 1
    if (b > a) return -1
    return 0
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const file = fs.readFileSync(fullPath, 'utf-8')

  const matterResult = matter(file)

  const proccessedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = proccessedContent.toString()

  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}