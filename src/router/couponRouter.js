import express from 'express'
import { createCoupon, showCoupons,editCoupon, deleteCoupon } from '../controllers/couponController.js'
import { token } from '../middleware/tokenMiddleware.js'

const router = express.Router()
router.get('/',token, showCoupons)
 router.post('/create',token,createCoupon)
 router.patch('/edit/:id',token,editCoupon)
 router.delete('/:id',token,deleteCoupon)

 export default router;