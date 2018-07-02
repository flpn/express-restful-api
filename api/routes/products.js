const express = require('express')
const multer = require('multer')

const checkAuth = require('../middlewares/check-auth')
const ProductController = require('../controllers/product')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true)
    else
    cb(null, false)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', ProductController.get_all_products)
router.get('/:productId', ProductController.get_product)
router.post('/', checkAuth, upload.single('productImage'), ProductController.create_product)
router.put('/:productId', checkAuth, ProductController.update_product)
router.delete('/:productId', checkAuth, ProductController.delete_product)

module.exports = router
