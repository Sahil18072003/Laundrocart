// const { request } = require('express')
const express = require('express');
const app = express();
const User = require('../models/user')
const Image = require('../models/cart')
//const currentdata = require('../models/currentOrders')

//this is for paytm
const config = require('../Paytm/config');
const checksum_lib = require('../Paytm/checksum');
const crypt = require('../Paytm/crypt');


module.exports.menu = function(req,res){
    return res.render('menu',{
        title : 'LaundroKart.Com',
        name : req.query.name,
        user_id : req.query.user_id,
    })
}

module.exports.events = function(req,res){
    return res.render('events',{
        title : 'Events'
    });
}

module.exports.edit_profile = function(req,res){
    return res.render('edit_profile',{
        title : 'Edit_Profile',
        text : '',
    });
}

module.exports.change_data = function(req,res){

    User.updateOne( { email : req.cookies.email },{ $set : {
            name : req.body.name ,
            phone : req.body.phone,
            address : req.body.address,
     }},
     function(err, result) {
        if (err)
        {
          console.log(err);
        }
        // else{
        //   console.log(result);
        // }
    }
     );

        res.clearCookie("name");
        res.cookie('name',req.body.name);

        return res.render('edit_profile',{
            text : 'SuccessFully Updated',
            email : req.body.email,
        })
}

module.exports.logout = function(req,res){
    res.clearCookie("user_id");
    res.clearCookie("name");
    res.clearCookie("email");

    return res.redirect('/');
}

module.exports.orders = function(req,res){
    // return res.render('orders',{
    //     title : 'Orders'
    // })

    Image.find({email: req.cookies.email},function(err,image){
       if(err){
        console.log('Error in finding Data');
         return;
       }
         return res.render('orders',{
            orders : image
         })
    });
}

module.exports.mydata = function(req,res){

     User.findOne({ _id : req.cookies.user_id },function(err,user){
        if(err){
           console.log('error in finding user in signing up'); return;
        }  
        else{
            return res.render('mydata',{
                User : user,
           });
        }    
     })
}

module.exports.price_lists = function(req,res){
    return res.render('price_lists',{
        title : 'Price_Lists'
    });
}

module.exports.PriceList = function(req,res){
    return res.render('PriceList/PriceList',{
        title : 'PriceListMenu'
    })
}

module.exports.content = function(req,res){
    return res.render('PriceList/fivestar');
}

module.exports.fivestar = function(req,res){
    return res.render('PriceList/fivestar');
}

module.exports.WashIron = function(req,res){
    return res.render('PriceList/WashIron');
}

module.exports.WashFold = function(req,res){
    return res.render('PriceList/WashFold');
}

module.exports.Dry_Cleaning = function(req,res){
    return res.render('PriceList/Dry_Cleaning');
}

module.exports.Shoe_Laundry = function(req,res){
    return res.render('PriceList/Shoe_Laundry')
}

module.exports.Steam_Ironing = function(req,res){
    return res.render('PriceList/Steam_Ironing');
}

module.exports.Carpet_Cleaning = function(req,res){
    return res.render('PriceList/Carpet_Cleaning');
}

module.exports.Roll_Polishing = function(req,res){
    return res.render('PriceList/Roll_Polishing');
}

module.exports.Pet_care = function(req,res){
    return res.render("PriceList/Pet_care");
}

module.exports.addcart = function(req, res){
    
   if(req.cookies.user_id){
    console.log(req.query);
        Image.create({
            name : req.query.name,
            email : req.cookies.email,
            price: req.query.price,
            qty : req.body.qty,
        },
        function(err,newNode){
            if(err){ console.log('Error In Creating User '+err); return;}
            console.log(newNode);
            return res.redirect('back');
        })
   }
   else{
        return res.render('PriceList/fivestar');
   }
    
}

module.exports.delete_order = function(req,res){
      var id = req.query.id;

      Image.findByIdAndDelete(id,function(err){
         if(err){
            console.log("Errorn In Deleing The data");
            return;
         }
         return res.redirect('back');
      })

}

module.exports.pay = function(req,res){
    return res.render('Orderpay',{
        amount : req.query.amount
    });
}

//this is for PayTm
// app.post("/paynow", [parseUrl, parseJson], (req, res) => {
module.exports.paynow = function(req,res) {    
    // Route for making payment
  
    var paymentDetails = {
      amount: req.body.amount,
      customerId: req.body.name,
      customerEmail: req.body.email,
      customerPhone: req.body.phone
  }
  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
      res.status(400).send('Payment failed')
  } else {
      var params = {};
      params['MID'] = config.PaytmConfig.mid;
      params['WEBSITE'] = config.PaytmConfig.website;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = paymentDetails.customerId;
      params['TXN_AMOUNT'] = paymentDetails.amount;
      params['CALLBACK_URL'] = 'http://localhost:3000/callback';
      params['EMAIL'] = paymentDetails.customerEmail;
      params['MOBILE_NO'] = paymentDetails.customerPhone;
  
  
      checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
          var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
          // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
  
          var form_fields = "";
          for (var x in params) {
              form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
          }
          form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
          res.end();
      });
  }
};

module.exports.callback = (req, res) => {
    // Route for verifiying payment
  
    var body = '';
  
    req.on('data', function (data) {
       body += data;
    });
  
     req.on('end', function () {
       var html = "";
       var post_data = qs.parse(body);
  
       // received params in callback
       console.log('Callback Response: ', post_data, "\n");
  
  
       // verify the checksum
       var checksumhash = post_data.CHECKSUMHASH;
       // delete post_data.CHECKSUMHASH;
       var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
       console.log("Checksum Result => ", result, "\n");
  
  
       // Send Server-to-Server request to verify Order Status
       var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
  
       checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
         params.CHECKSUMHASH = checksum;
         post_data = 'JsonData='+JSON.stringify(params);
  
         var options = {
           hostname: 'securegw-stage.paytm.in', // for staging
           // hostname: 'securegw.paytm.in', // for production
           port: 443,
           path: '/merchant-status/getTxnStatus',
           method: 'POST',
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Content-Length': post_data.length
           }
         };
  
  
         // Set up the request
         var response = "";
         var post_req = https.request(options, function(post_res) {
           post_res.on('data', function (chunk) {
             response += chunk;
           });
  
           post_res.on('end', function(){
             console.log('S2S Response: ', response, "\n");
  
             var _result = JSON.parse(response);
               if(_result.STATUS == 'TXN_SUCCESS') {
                   res.send('payment sucess')
                   
               }else {
                   res.send('payment failed')
               }
             });
         });
  
         // post the data
         post_req.write(post_data);
         post_req.end();
        });
       });
  };



