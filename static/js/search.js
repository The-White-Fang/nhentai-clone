$(function () {
	$('.more-options span').on('click', function () {
		let $el = $(this);

		if (!$el.data('display')) {
			// Show filters
			$el.text('Less');
			$('.filters').addClass('show');
			$el.data('display', 1);
		} else {
			// Hide filters
			$el.text('More');
			$('.filters').removeClass('show');
			$el.data('display', 0);
		}
	});

	let ajaxPromise = () => {
		let tagsPromise = $.ajax({ url: '/api/tags' }).promise(),
			charactersPromise = $.ajax({ url: '/api/characters' }).promise(),
			parodiesPromise = $.ajax({ url: '/api/parodies' }).promise();;

		return Promise.all([tagsPromise, charactersPromise, parodiesPromise]);
	}

	let createHiddenForm = (data) => {
		let $form = $('<form/>'),
			keys = Object.keys(data);

		$form.attr({
			hidden: true,
			action: '/advance-search',
			method: 'POST'
		});

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i],
				$input = $('<input/>');

			$input.attr({
				type: 'text',
				name: key,
				value: data[key]
			});

			$form.append($input);
		}

		return $form;
	}

	let get = async () => {
		const [tags, characters, parodies] = await ajaxPromise();

		function eventFunc(event) {
			let $el = $(this),
				val = $el.val().toLowerCase(),
				data = event.data,
				$ul = $el.parent().find('ul'),
				ulVisible = $ul.is(':visible'),
				selected = $ul.data('selected'),
				html = '';

			selected = selected ? selected : [];

			$ul.html('');

			if (val.length < 2) {
				$ul.hide();
				return;
			}

			for (let i = 0, datum; i < data.length; i++) {
				datum = data[i];

				if (selected.includes(datum)) {
					continue;
				}

				if (datum.match(RegExp(val))) {
					html += '<li>' + datum + '</li>';

					if (!ulVisible) {
						$ul.show();
					}
				}
			}

			$ul.append(html);

			if ($ul.is(':empty')) {
				$ul.hide();
			}
		}

		$('#tags-input').on('input', tags, eventFunc);

		$('#characters-input').on('input', characters, eventFunc);

		$('#parodies-input').on('input', parodies, eventFunc);
	}

	$('.filter input').on('focus', function () {
		let $ul = $(this).parent().find('ul');

		if (!$ul.is(':empty')) {
			$ul.show();
		}
	});

	$('.filter input').on('focusout', function () {
		$(this).parent().find('ul').hide();
	});

	$('.filter').on('mousedown', '#tags-list li, #characters-list li', function (event) {
		event.preventDefault();
		let $el = $(this),
			$ul = $el.parent(),
			data = $ul.data('selected'),
			val = $el.text();

		data = data ? data : [];

		if (data.includes(val)) {
			return;
		}

		data.push(val);

		$ul.data('selected', data);

		$el.remove();

		let $div = $('<div/>').addClass('selected'),
			$btn = $('<button/>').addClass('remove-btn').text('\u2716').attr('type', 'button'),
			$span = $('<span/>').addClass('name').text(val);

		$div.append($btn, $span);
		$ul.siblings('input').before($div);
		$ul.siblings('input').val('');
		$ul.html('');
		$ul.hide();
	});

	$('.filter input').on('keydown', function (event) {
		if (event.keyCode == 13) {
			$(this).siblings('ul').find('.active').trigger('mousedown');
			event.preventDefault();
		}
	});

	$('.filter input').on('keydown', function (event) {
		let $el = $(this),
			$ul = $el.siblings('ul'),
			data = $ul.data('selected');
		if (!$el.val() && event.keyCode == 8) {
			if (data) {
				data.pop();
				$ul.data('selected', data);
				$ul.siblings('.selected').eq(-1).remove();
			}
		}
	});

	$('.filter input').on('keydown', function (event) {
		let upArrowKey = 38, downArrowKey = 40, keyCode = event.keyCode;

		if (keyCode != upArrowKey && keyCode != downArrowKey) {
			return;
		}

		let $el = $(this),
			$ul = $el.siblings('ul'),
			$active = $ul.find('li.active'),
			$nextActive;

		if (!$active.length) {
			if (keyCode == upArrowKey) {
				$nextActive = $ul.find('li').eq(-1);
			} else {
				$nextActive = $ul.find('li').eq(0);
			}
			$active.addClass('active');
		} else if (keyCode == upArrowKey) {
			$nextActive = $active.prev('li');
			$nextActive = $nextActive.length ? $nextActive : $ul.find('li').eq(-1);
		} else if (keyCode == downArrowKey) {
			$nextActive = $active.next('li');
			$nextActive = $nextActive.length ? $nextActive : $ul.find('li').eq(0);
		}

		$active.removeClass('active');
		$nextActive.addClass('active');

		$ul.animate({
			scrollTop: $nextActive.offset().top - $ul.offset().top + $ul.scrollTop()
		}, 100)

		event.preventDefault();
	});

	$('.filter').on('mouseenter', 'li', function () {
		$(this).addClass('active');
	}).on('mouseleave', 'li', function () {
		$(this).removeClass('active');
	})

	$('.filter').on('mousedown', '#parodies-list li', function (event) {
		event.preventDefault();
		$('#parodies-input').val(this.innerText);
		$('#parodies-list').hide();
	});

	$('.filter').on('click', '.remove-btn', function (event) {
		let $el = $(this),
			val = $el.siblings('span').text(),
			$ul = $el.parents('.filter').find('ul');

		$el.parent().remove();
		$ul.data('selected', $ul.data('selected').filter(x => x != val));
	});

	$('#search-form').on('submit', function (event) {
		event.preventDefault();
		window.location.href = '/search/' + $(this).find('input').val()
	});

	$('#filters-form').on('submit', function (event) {
		let $form = $(this),
			tags = $form.find('#tags-list').data('selected'),
			characters = $form.find('#characters-list').data('selected'),
			parodies = $form.find('#parodies-input').val(),
			category = $form.find('#category').val();

		createHiddenForm({
			term: $('#search').val(),
			tags: tags ? JSON.stringify(tags) : '',
			characters: characters ? JSON.stringify(characters) : '',
			parodies: parodies,
			category: category
		}).appendTo('body').submit();

		event.preventDefault();
	});

	$('#filters-form .reset').on('click', function () {
		$('#filters-form .selected').remove();
		$('#filters-form ul').data('selected', []);
		$('#filters-form input').val('');
		$('#filters-form select').val('');
	});

	get();
})