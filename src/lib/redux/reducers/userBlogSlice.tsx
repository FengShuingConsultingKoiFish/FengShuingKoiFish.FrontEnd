import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// Define the types for the state

interface ImageViewDtos {
  id: number
  filePath: string
  altText?: string | null
  userId: string
  userName: string
  createdDate: string
}

interface BlogDetail {
  id: number
  title: string
  content: string
  userName: string
  createdDate: string
  status: string
  imageViewDtos: ImageViewDtos[]
}

interface BlogsState {
  blogsList: BlogDetail[]
  detailBlog: BlogDetail | null
  currentBlog: BlogDetail | null
  blogHistory: BlogDetail[]
}

// Initial state with type annotations
const initialState: BlogsState = {
  blogsList: [],
  detailBlog: null,
  currentBlog: null,
  blogHistory: []
}

const userBlogsSlice = createSlice({
  name: "userBlogs",
  initialState,
  reducers: {
    setBlogsList: (state, action: PayloadAction<BlogDetail[]>) => {
      state.blogsList = action.payload
    },

    setDetailBlog: (state, action: PayloadAction<BlogDetail | null>) => {
      state.detailBlog = action.payload
    },

    updateBlogDetail: (state, action: PayloadAction<Partial<BlogDetail>>) => {
      if (state.detailBlog) {
        state.detailBlog = { ...state.detailBlog, ...action.payload }
      }
    },
    setCurrentBlog: {
      reducer: (state, action: PayloadAction<{ blog: BlogDetail }>) => {
        state.currentBlog = action.payload.blog
      },
      prepare: (blog: BlogDetail) => ({ payload: { blog } })
    },

    clearCurrentBlog: (state) => {
      state.currentBlog = null
    },

    setBlogHistory: (state, action: PayloadAction<BlogDetail[]>) => {
      state.blogHistory = action.payload
    },

    addBlog: (state, action: PayloadAction<BlogDetail>) => {
      state.blogsList.push(action.payload)
    },

    removeBlog: (state, action: PayloadAction<number>) => {
      state.blogsList = state.blogsList.filter(blog => blog.id !== action.payload)
    }
  }
})

export const {
  setBlogsList,
  setDetailBlog,
  updateBlogDetail,
  setCurrentBlog,
  clearCurrentBlog,
  setBlogHistory,
  addBlog,
  removeBlog
} = userBlogsSlice.actions

export default userBlogsSlice.reducer
