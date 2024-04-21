const express = require('express');

const router = express.Router();

const  homeController = require('../controllers/home_controller');
const profileController = require('../controllers/profile_controller');

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

router.get('/',homeController.home);
router.get('/offer',homeController.offers);
router.get('/profile',homeController.profile);
router.get('/price_lists',profileController.price_lists);
router.get('/ScheduleWash',homeController.ScheduleWash);
router.get('/register',homeController.register);
router.get('/login',homeController.login);
router.get('/franchisee',homeController.franchisee);
router.post('/getInTouch',homeController.getInTouch);
router.get('/store_locator',homeController.store_locator);
router.get('/team',homeController.team);

//to connect with database
router.post('/create',homeController.create);
router.post('/login',homeController.entry);

//for adding and deleting from cart
router.post('/addcart',profileController.addcart);
router.get('/delete_order',profileController.delete_order);

//for profile after login/register
router.get('/menu',profileController.menu);
router.get('/events',profileController.events);
router.get('/edit_profile',profileController.edit_profile);
router.post('/change_data',profileController.change_data);
router.get('/orders',profileController.orders);
router.get('/logout',profileController.logout);
router.get('/mydata',profileController.mydata);

//for payment
router.get('/pay',profileController.pay);
router.post('/paynow',profileController.paynow);
router.post('/callback',profileController.callback);


//for price List
router.get('/PriceList',profileController.PriceList);
router.get('/content',profileController.content);
router.get('/fivestar',profileController.fivestar);
router.get('/WashIron',profileController.WashIron);
router.get('/WashFold',profileController.WashFold);
router.get('/Dry_Cleaning',profileController.Dry_Cleaning);
router.get('/Shoe_Laundry',profileController.Shoe_Laundry);
router.get('/Steam_Ironing',profileController.Steam_Ironing);
router.get('/Carpet_Cleaning',profileController.Carpet_Cleaning);
router.get('/Roll_Polishing',profileController.Roll_Polishing);
router.get('/Pet_care',profileController.Pet_care);

module.exports = router;


