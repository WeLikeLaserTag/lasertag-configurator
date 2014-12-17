LasertagConfigurator.service('FeedService', ['$rootScope', '$http', function($rootScope, $http) {

	var posts = [];

	function fill() {
		$http.get('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&q=http://xraymeta.ghost.io/rss/').success(function(data) {
			data.responseData.feed.entries.forEach(function(post) {
				posts.push(post);
			});
		});
	}

	fill();

	return Object.freeze({
		get: function() {
			return posts;
		}
	});
}]);