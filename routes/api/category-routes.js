const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  let resdata = await Category.findAll().catch(function (err) {
    res.json(err);
  });
  res.json(resdata);
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  let resdata = await Category.findOne({ where: { id: req.params.id}})
  .catch(function (err) {
    res.json(err);
  });
  res.json(resdata);
});

router.post('/', async (req, res) => {
  // create a new category
  //console.log(req.body)
  try {
    let putdata = await Category.create(req.body);
    res.status(200).json(putdata);
  } catch (err) {
    res.status(200).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    let putdata = await Category.update(req.body,{where:{id: req.params.id}});
    res.status(200).json(putdata);
  } catch (err) {
    res.status(200).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
  deldata = await Category.destroy({where:{id: req.params.id}});
  res.status(200).json(deldata);
  } catch (err) {
    res.status(200).json(err)
  }
});

module.exports = router;
