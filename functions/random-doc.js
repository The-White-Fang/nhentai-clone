module.exports = async function (Model, count, filter = {}){
	return Model.aggregate([
		{
			$match: filter
		},
		{
			$sample: { size: count }
		}
	]);
}