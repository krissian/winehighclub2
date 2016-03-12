// This is a JavaScript file
angular.module('app').factory('ConstantService', function() {
  return {
        //wsURL : 'https://www.winehighclub.com/product_list/ws',
        wsURL : 'http://www.winehighclub.com/product_list/ws',
        imgURL: 'http://www.winehighclub.com/cms/index.php?option=com_virtuemart&view=productdetails&lang=en&virtuemart_product_id=',
        thumbnailURL: 'http://www.winehighclub.com/cms/components/com_virtuemart/shop_image/product/resized/',
        productImgURL: 'http://www.winehighclub.com/cms/components/com_virtuemart/shop_image/product/',
        cmsURL: 'http://www.winehighclub.com/cms/',
        appInit: false,
        winesByCat: '',
        localImgURL: '',
  };
});

