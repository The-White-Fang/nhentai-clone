(function ($) {
	"use strict";

	$(function () {
		var header = $(".start-style");
		$(window).scroll(function () {
			var scroll = $(window).scrollTop();

			if (scroll >= 10) {
				header.removeClass("start-style").addClass("scroll-on");
			} else {
				header.removeClass("scroll-on").addClass("start-style");
			}
		});
	});

	$("body").on("mouseenter mouseleave", ".nav-item", function (e) {
		if ($(window).width() > 750) {
			var _d = $(e.target).closest(".nav-item");
			_d.addClass("show");
			setTimeout(function () {
				_d[_d.is(":hover") ? "addClass" : "removeClass"]("show");
			}, 1);
		}
	});

	//sticky socials
	var $shares = $(".socials-sticky"),
		$sharesHeight = $shares.height(),
		$sharesTop,
		$sharesCon = $shares.parent(),
		$sharesConTop,
		$sharesConleft,
		$sharesConHeight,
		$sharesConBottom,
		$offsetTop = 80;

	function setStickyPos() {
		if ($shares.length > 0) {
			$sharesTop = $shares.offset().top;
			$sharesConTop = $sharesCon.offset().top;
			$sharesConleft = $sharesCon.offset().left;
			$sharesConHeight = $sharesCon.height();
			$sharesConBottom = $sharesConHeight + $sharesConTop;
		}
	}

	function stickyShares(wScroll) {
		if ($shares.length > 0) {
			if ($sharesConBottom - $sharesHeight - $offsetTop < wScroll) {
				$shares.css({
					position: "absolute",
					top: $sharesConHeight - $sharesHeight,
					left: 0
				});
			} else if ($sharesTop < wScroll + $offsetTop) {
				$shares.css({
					position: "fixed",
					top: $offsetTop,
					left: $sharesConleft
				});
			} else {
				$shares.css({ position: "absolute", top: 0, left: 0 });
			}
		}
	}

	$(window).on("scroll", function () {
		stickyShares($(this).scrollTop());
	});

	$(window).resize(function () {
		setStickyPos();
		stickyShares($(this).scrollTop());
	});

	setStickyPos();
})(jQuery);
