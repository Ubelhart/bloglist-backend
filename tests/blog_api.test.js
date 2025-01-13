const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)
    assert(titles.includes('React patterns'))
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
  })
})

describe('addition of a new note', () => {
  test('succeds with valid data', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'New author',
      url: 'http://newblog.com',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes(newBlog.title))
  })

  test('if the likes property is missing from the request, it will default to 0', async () => {
    const newBlog = {
      title: 'New blog',
      url: 'http://newblog.com',
    }

    const response = await api

      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status code 400 if data invalid', async () => {
    const newBlog = {
      author: 'New author',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })
  test('fails with status code 400 if id is invalid', async () => {
    await api.delete('/api/blogs/1234').expect(400)
  })
  test('fails with status code 404 if id is not found', async () => {
    await api.delete('/api/blogs/123456789012345678901234').expect(404)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'Updated blog',
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes(updatedBlog.title))
  })
  test('likes are updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      likes: 100,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogAtEnd = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    )

    assert.strictEqual(updatedBlogAtEnd.likes, updatedBlog.likes)
  })
  test('fails with status code 400 if id is invalid', async () => {
    await api.put('/api/blogs/1234').expect(400)
  })
})

after(() => {
  mongoose.connection.close()
})
