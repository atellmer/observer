;
(function () {
	'use strict';

	var publisher = {
		subscribers: {
			any: []
		},
		$on: function (type, fn) {
			type = type || 'any';
			if (!this.subscribers[type]) {
				this.subscribers[type] = [];
			}
			this.subscribers[type].push(fn);
		},
		$off: function (type, fn) {
			this.mapSubscribers('off', type, fn);
		},
		$publish: function (type, publication) {
			this.mapSubscribers('publish', type, publication);
		},
		mapSubscribers: function (action, type, arg) {
			var pubtype = type || 'any';
			var subscribers = this.subscribers[pubtype];

			for (var i = 0, len = subscribers.length; i < len; i++) {
				if (action === 'publish') {
					subscribers[i](arg);
				}
				if (action === 'off') {
					if (subscribers[i] === arg) {
						subscribers.splice(i, 1);
					}
				}
			}
		}
	};

	function makePublisher(o) {
		for (var i in publisher) {
			if (publisher.hasOwnProperty(i) && typeof publisher[i] === 'function') {
				o[i] = publisher[i];
			}
		}
		o.subscribers = {
			any: []
		};
	}

	var $scope = {};
	var controller = {
		eventHandler: function (data) {
			renderDOM('#list', 'li', data);
		}
	};

	makePublisher($scope);

	var clickme = document.querySelector('#clickme');
	var subscribe = document.querySelector('#subscribe');
	var unsubscribe = document.querySelector('#unsubscribe');

	clickme.addEventListener('click', function () {
		var data = 'Event! => current date: ' + Date.now();
		$scope.$publish('sendMessage', data);
	});

	subscribe.addEventListener('click', function () {
		$scope.$on('sendMessage', controller.eventHandler);

		renderDOM('#list', 'li', 'client subscribed :)');
	});

	unsubscribe.addEventListener('click', function () {
		$scope.$off('sendMessage', controller.eventHandler);

		renderDOM('#list', 'li', 'client unsubscribed :(');
	});

	function renderDOM(parent, el, data) {
		var parent = document.querySelector(parent);
		var el = document.createElement(el);

		el.innerHTML = data;
		parent.appendChild(el);
	}

})();