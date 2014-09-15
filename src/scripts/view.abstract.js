(function (window, document) {

	define([
		'backbone'
		// DEPS
		, 'backbone.babysitter'
	], function (Backbone) {
		var View = Backbone.View.extend({
			close: function () {
				this.remove();
				this.unbind();

				if (typeof this.onClose === 'function') {
					this.onClose.apply(this, arguments);
				}

				return this;
			}

			, empty: function (el) {
				while ((el || this.el).firstChild) {
					(el || this.el).removeChild((el || this.el).firstChild);
				}

				return this;
			}

			, hide: function () {
				this.el.classList.remove('set');
				this.el.classList.add('unset');

				if (typeof this.onHide === 'function') {
					this.onHide.apply(this, arguments);
				}

				return this;
			}

			, show: function () {
				this.el.classList.remove('unset');
				this.el.classList.add('set');

				if (typeof this.onShow === 'function') {
					this.onShow.apply(this, arguments);
				}

				return this;
			}

			, reset: function () {
				if (this.collection) {
					this.collection.reset.apply(this.collection, arguments);
				}
				else if (this.model) {
					this.model.reset.apply(this.model, arguments);
				}

				this.empty();
				this.hide();

				if (typeof this.onReset === 'function') {
					this.onReset.apply(this, arguments);
				}

				return this;
			}

			, insertElement: function (insertBefore) {
				if (insertBefore) {
					document.body.insertBefore(this.el, document.body.firstChild);
				}
				else {
					document.body.appendChild(this.el);
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
