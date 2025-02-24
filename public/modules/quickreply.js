'use strict';

define('persona/quickreply', [
	'components', 'composer/autocomplete', 'api', 'alerts',
], function (components, autocomplete, api, alerts) {
	var QuickReply = {};

	QuickReply.init = function () {
		var element = components.get('topic/quickreply/text');
		var data = {
			element: element,
			strategies: [],
			options: {
				style: {
					'z-index': 100,
				},
				// listPosition: function(position) {
				// 	this.$el.css(this._applyPlacement(position));
				// this.$el.css('position', 'absolute');
				// return this;
				// }
			},
		};

		$(window).trigger('composer:autocomplete:init', data);
		autocomplete._active.persona_qr = autocomplete.setup(data);
		// data.element.textcomplete(data.strategies, data.options);
		// $('.textcomplete-wrapper').css('height', '100%').find('textarea').css('height', '100%');

		var ready = true;
		components.get('topic/quickreply/button').on('click', function (e) {
			e.preventDefault();
			if (!ready) {
				return;
			}

			var replyMsg = components.get('topic/quickreply/text').val();
			var replyData = {
				tid: ajaxify.data.tid,
				handle: undefined,
				content: replyMsg,
			};

			ready = false;
			api.post(`/topics/${ajaxify.data.tid}`, replyData, function (err, data) {
				ready = true;
				if (err) {
					return alerts.error(err);
				}
				if (data && data.queued) {
					alerts.alert({
						type: 'success',
						title: '[[global:alert.success]]',
						message: data.message,
						timeout: 10000,
						clickfn: function () {
							ajaxify.go(`/post-queue/${data.id}`);
						},
					});
				}

				components.get('topic/quickreply/text').val('');
				autocomplete._active.persona_qr.hide();
			});
		});
	};

	return QuickReply;
});
