var RedGlassApp = angular.module('starter', ['ionic', 'angular-carousel'])

.run(function($ionicPlatform, $ionicPopup) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		
		if (window.AndroidFullScreen) {
			var successFullScreenCallback = function () {
				console.log("successFullScreenCallback");
			}
			var failureFullScreenCallback = function () {
				console.log("failureFullScreenCallback");
			}
			
			AndroidFullScreen.immersiveMode(successFullScreenCallback, failureFullScreenCallback);
		}
		
		var bodyEl = document.querySelector("body");
		bodyEl.style.width = "600px";
		bodyEl.style.marginLeft = (window.innerWidth - 600) / 2 + "px";
		bodyEl.style.height = "1000px";
	
		if (navigator && navigator.connection && navigator.connection.type == Connection.NONE) {
			$ionicPopup.confirm({
				title: "Internet Disconnected",
				content: "The internet is disconnected on your device."
			})
			.then(function(result) {
				if (!result) {
					ionic.Platform.exitApp();
				}
			});
		}
	});
})

RedGlassApp.controller('bodyController', function($scope, $http) {
	$scope.dataUrlPrefix = "http://tienpingx2.96.lt/crud";
	$scope.partner_name = "suyi";
	
	$scope.updateCarousel = function redGlassDisplay_updateCarousel(dataObj) {
		var partnerImageLength = 0;
		for(var i = 1; i <= 5; i++) {
			var imageName = "partner_image" + i;
			var imageObj = dataObj["partner_image_" + i]
			if (imageObj) {
				partnerImageLength++;
			}
		}
		
		var slideShowArr = eval(dataObj.slide_show);
		if (!slideShowArr || !(slideShowArr instanceof Array)) {
			alert("No data for slide show");
			console.error("No data for slide show");
		}
		
		var advertisementLength = slideShowArr.length;
		
		var finalSlideShowArr = [];
		if (partnerImageLength > 0 && advertisementLength > 0) {
			var interval = Math.floor(advertisementLength / partnerImageLength);
			var remainder = advertisementLength % partnerImageLength;
			
			for (ii = 1; ii <= 5; ii++) {
				if (dataObj["partner_image_" + ii]) {
					for (jj = 0; jj < interval; jj++) {
						finalSlideShowArr.push(slideShowArr.shift());
					}
					if (remainder > 0 && slideShowArr.length > 0) {
						finalSlideShowArr.push(slideShowArr.shift());
						remainder--;
					}
					finalSlideShowArr.push("/partner" + dataObj["partner_image_" + ii]);
				}
			}
		} else if (advertisementLength > 0){
			finalSlideShowArr = slideShowArr;
		} else if (partnerImageLength > 0){
			finalSlideShowArr = slideShowArr;
		}
		
		$scope.images = finalSlideShowArr;
		// console.log("finalSlideShowArr", finalSlideShowArr);
		
		var contentLoadingImage = document.querySelector("#content-loading-image");
		contentLoadingImage.style.display = "none";
	}
	
	$scope.getCarouselItems = function redGlassDisplay_getCarouselItems() {
		$http.get($scope.dataUrlPrefix + "/api/getSlideShowInfo.php?partner_name=" + $scope.partner_name)
			.success(function (response) {
				if (response && response[0]) {
					var dataObj = response[0];
					
					if (dataObj) {
						$scope.updateCarousel(dataObj);
					}
				}
			}
		);
	}
	
	var refreshData = function redGlassDisplay_refreshData() {
		$scope.getCarouselItems();
	}
	setInterval(refreshData, 30 * 1000);
});

RedGlassApp.controller('footerController', function($scope) {
	/*
	$scope.images = [
		"img/restaurant/jdf-2.jpg"
	];
	*/
});