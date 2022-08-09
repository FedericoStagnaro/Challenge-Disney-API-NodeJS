const router = require('express').Router()
const characterControllers = require('../controllers/characters')
const { verifyJWT } = require('../middleware/verifyJWT')
const {verifyRoles} = require('../middleware/verifyRoles')

/** 
 * CREATE Character || need role admin
 */
router.post('/',verifyJWT,verifyRoles('admin'), characterControllers.createCharacter)

/** 
 * READ Characters || public role
 */
router.get('/',verifyJWT, characterControllers.getAllFiltered)
router.get('/:id',verifyJWT, characterControllers.getCharacter)
 

/** 
 * UPDATE Characters || need role admin
 */
router.put('/:id',verifyJWT,verifyRoles('admin'), characterControllers.putCharacter)
router.patch('/:id',verifyJWT,verifyRoles('admin'), characterControllers.patchCharacter)

/** 
 * DELETE Characters|| need role admin
 */
router.delete('/:id',verifyJWT,verifyRoles('admin'), characterControllers.deleteCharacter)

module.exports = router

