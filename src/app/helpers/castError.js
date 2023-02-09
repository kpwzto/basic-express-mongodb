const castError = function(schema, options = {}) {
	schema.post('validate', function(error, doc, next) {
		Object.values(error.errors)
			.filter(fieldError => fieldError.name === 'CastError')
			.forEach(fieldError => {
				fieldError.message = options.messageKey || 'error.common.cast'+fieldError.message;
			});
		next(error);
	});
};
module.exports = castError;