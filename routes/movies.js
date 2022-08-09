const router = require('express').Router()
const movieControllers = require('../controllers/movies')
const { verifyJWT } = require('../middleware/verifyJWT')
const {verifyRoles} = require('../middleware/verifyRoles')

// /** 
//  * CREATE Character
//  */
router.post('/',verifyJWT,verifyRoles('admin'), movieControllers.createMovie)

/** 
  * READ Characters
  */
router.get('/',verifyJWT, movieControllers.getAllFiltered)
router.get('/:id',verifyJWT, movieControllers.getMovie)
  
 
// /** 
//   * UPDATE Characters
//   */
router.put('/:id',verifyJWT,verifyRoles('admin'), movieControllers.putMovie)
router.patch('/:id',verifyJWT,verifyRoles('admin'), movieControllers.patchMovie)
 
// /** 
//   * DELETE Characters
//   */
router.delete('/:id',verifyJWT,verifyRoles('admin'), movieControllers.deleteMovie)


module.exports = router