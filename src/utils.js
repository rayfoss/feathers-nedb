import errors from 'feathers-errors';

export function multiOptions(id, params) {
  let query = Object.assign({}, params.query);
  let options = Object.assign({ multi: true }, params.options);

  if(id !== null) {
    options.multi = false;
    query._id = id;
  }

  return { query, options };
}

export function mapItems(id) {
  return function(items) {
    if(!items.length) {
      throw new errors.NotFound(`No record found for id '${id}'`);
    }

    return items.length === 1 ? items[0] : items;
  };
}

export function getSelect(select) {
	if(Array.isArray(select)) {
		var result = {};
		select.forEach(name => result[name] = 1);
		return result;
	}

	return select;
}

export function nfcall(ctx, method) {
	let args = Array.prototype.slice.call(arguments, 2);

	return new Promise((resolve, reject) => {
		args.push(function(error, data) {
			if(error) {
				return reject(error);
			}

			resolve(data);
		});

		ctx[method].apply(ctx, args);
	});
}
