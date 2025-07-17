const Blog = require('../Models/blog-model');


const postBlog = async (req, res, next) => {
    try {
        const { title, content, category, tags } = req.body;
        const thumbnail = req.file?.filename;

        const author = req.user.userId;
        if (!title || !content || !category || !thumbnail) {
            return res.status(400).json({ message: 'Title, content, thumbnail, and category are required.' });
        }

        const fullThumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/${thumbnail}`

        const newBlog = new Blog({
            thumbnail: fullThumbnailUrl,
            title,
            content,
            author,
            category,
            tags: tags || [],
        });
        await newBlog.save();
        return res.status(201).json({ message: 'Blog posted successfully', blog: newBlog });
    } catch (error) {
        next(error)
    }
}

const getBlogs = async (req, res, next) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ message: 'Invalid page or limit value' });
        }

        const getAllBlogs = await Blog.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate('author', 'username email')
        const total = await Blog.countDocuments()
        console.log("Page:", req.query.page, "Limit:", req.query.limit);

        return res.status(200).json({
            blogs: getAllBlogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBlogs: total

        })

    } catch (error) {
        next(error);

    }
}


const getBlogById = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }
        const blog = await Blog.findById(id).populate('author', 'username email bio avatar website location createdAt _id');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        return res.status(200).json({ blog })


    } catch (error) {
        next(error);
    }
}


const getBlogOfAuther = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 })
        console.log("Author ID from Token:", userId);
        res.status(200).json(blogs);
    } catch (error) {
        next(error)
    }
}



const deleteBlogById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }
        const deleteBlog = await Blog.findByIdAndDelete(id);

        if (!deleteBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        return res.status(200).json({ message: 'Blog Deleted Successfully' })

    } catch (error) {
        next(error)
    }
}



const updateBlogById = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: 'Blog ID is required' });
        }
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            tags: req.body.tags || []
        }

        if (req.file) {
            updateData.thumbnail = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, { $set: updateData }, { new: true })



        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog Updated Successfully', blog: updatedBlog })
    } catch (error) {
        next(error)
    }
}

module.exports = { postBlog, getBlogs, getBlogById, deleteBlogById, updateBlogById, getBlogOfAuther };