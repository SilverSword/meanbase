angular.module('meanbaseApp').controller('blogController', function ($rootScope, $scope, api, vcRecaptchaService, $timeout) {
  if(!$rootScope.page.lists.socialFooter1) {
    $rootScope.page.lists.socialFooter1 = {
      items: []
    }
  }
});
