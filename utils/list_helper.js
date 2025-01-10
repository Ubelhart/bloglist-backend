const _ = require('lodash')

const dummy = (blogs) => {
  if (blogs) return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes))
  return blogs.find((blog) => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const authorCount = _.countBy(blogs, 'author')
  const authors = _.keys(authorCount)
  const authorWithMostBlogs = _.maxBy(authors, (author) => authorCount[author])
  return {
    author: authorWithMostBlogs,
    blogs: authorCount[authorWithMostBlogs],
  }
}

const mostLikes = (blogs) => {
  const likesByAuthor = _.groupBy(blogs, 'author')
  const authors = _.keys(likesByAuthor)
  const authorWithMostLikes = _.maxBy(authors, (author) =>
    _.sumBy(likesByAuthor[author], 'likes')
  )
  return {
    author: authorWithMostLikes,
    likes: _.sumBy(likesByAuthor[authorWithMostLikes], 'likes'),
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
