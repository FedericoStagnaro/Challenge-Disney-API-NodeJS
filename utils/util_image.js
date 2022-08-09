const path = require('path')
const uuid = require('uuid')
const fs = require('fs')


class ImageProcessingError extends Error {
    constructor (message, errorsList) {
        super(message)
        this.errors = errorsList
        this.name = 'ImageError'
    }
}

/**
 * Check the passed files and throw exceptions, return image file
 * @param {Object} Request.files Provided by express-upload 
 * @return {Object} Image file
 */
const getFileImage = (files) => {
    if ( files && 'image' in  files) {
        let errors = []
        const dataTypes = /(jpeg)|(jpg)|(gif)|(png)$/

        if ( !dataTypes.test(files.image.mimetype) ) { errors.push({ path: 'ext', message:'File type must be jpeg, jpg, png...'}) } 

        if ( files.image.size > 5 * 1024 * 1024 ) { errors.push({ path: 'size', message: 'File size cannot be larger than 5mb.'}) }

        if (errors.length > 0) {
            throw new ImageProcessingError('Invalid image file: ',errors)
        }
        return files.image
    }
    else { return null } 
}

/**
 * Returns new name with extension file
 * @param image files 
 * @returns 
 */
const getNameFileUUID = (image) => {
    const ext = path.extname(image.name)
    const newNameFile = uuid.v4() + ext
    return newNameFile
}

/**
 * Save the file
 * @param {Object} file File Object
 * @param {String} filename Name to save the file
 */
const saveImage = async (image,filename) => {
    const pathFile = path.join(__dirname, '../', 'public' , filename)
    await image.mv(pathFile)
}

/**
 * Delete from host/public the given filename.ext
 * @param {String} filename.etx Name to save the file
 */
const deleteImage =  (filename) => { 
    const pathFile = path.join(__dirname, '../public', filename)
    fs.unlink(pathFile, (error) => {if (error) throw error })
}

module.exports = {
    getFileImage,
    getNameFileUUID,
    saveImage,
    deleteImage
}