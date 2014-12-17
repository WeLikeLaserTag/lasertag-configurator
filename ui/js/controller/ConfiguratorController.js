LasertagConfigurator.controller('ConfiguratorController', ['$scope', function ($scope, FeedService) {

	var baseMarkerStats = {
		ammoInMag: 20,
		totalAmmo: 120,
		timeBetweenShots: 200,
		criticalHitChance: 5,
		silencer: false
	};

	var extensionPoints = 13;

	var activePerks = [];

	$scope.perks = [
		{
			name: 'Ammo in magazine',
			stat: 'ammoInMag',
			value: 4,
			levels: [
				0,
				1,
				2,
				4,
				6
			]
		}, {
			name: 'Total ammo',
			stat: 'totalAmmo',
			value: 20,
			levels: [
				0,
				1,
				2,
				4,
				6
			]
		}, {
			name: 'Time between shots',
			stat: 'timeBetweenShots',
			value: -20,
			levels: [
				0,
				1,
				2,
				4,
				6
			]
		}, {
			name: 'Silencer',
			stat: 'silencer',
			value: true,
			levels: [
				0,
				2
			]
		}
	];

	function getPerkConfig (statName) {
		return $scope.perks.filter(function (perk) {
			return statName === perk.stat;
		})[0];
	}

	function getUsedPoints () {
		var usedPoints = 0;
		activePerks.forEach(function (perk) {
			usedPoints += perk.costs;
		});
		return usedPoints;
	}

	$scope.getRemainingPoints = function () {
		return extensionPoints - getUsedPoints();
	};

	$scope.getMarkerStats = function () {
		var stats = {};
		for (var statName in baseMarkerStats) {
			stats[statName] = baseMarkerStats[statName];
			activePerks.forEach(function (perk) {
				if (perk.stat === statName) {
					stats[statName] += perk.value;
				}
			});
		}
		return stats;
	};

	$scope.perkIsActive = function (stat, value) {
		var matchingPerks = activePerks.filter(function(perk) {
			return perk.stat == stat && perk.value == value;
		});

		return matchingPerks.length > 0
	};

	$scope.activatePerk = function (name, level) {
		var perkConfig = getPerkConfig(name);
		var costs = perkConfig.levels[level];
		var usedPoints = getUsedPoints();

		activePerks = activePerks.filter(function (perk) {
			return perk.stat !== name;
		});

		if (extensionPoints - usedPoints < costs) {
			return false;
		}

		var val;
		if (typeof perkConfig.value === 'boolean') {
			val = perkConfig.value;
		} else {
			val = perkConfig.value * level;
		}

		activePerks.push({
			stat: name,
			costs: costs,
			value: val
		});

	};

}]);