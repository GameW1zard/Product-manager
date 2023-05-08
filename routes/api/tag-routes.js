const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  let resdata = []

  let Tagdata = await Tag.findAll().catch(function (err) {
    res.json(err);
  });

  for (let i = 0, len = Tagdata.length; i < len; i++) {
    let tempdata = {
      tag: null,
      products: []
    }
    tempdata.tag = await Tag.findOne({where: {id: Tagdata[i].id}})
    tagfinder = await ProductTag.findAll({where: {tag_id: Tagdata[i].id}})
    for (let h = 0, len = tagfinder.length; h < len; h++) {
      tempdata.products[h] = await Product.findOne({where: {id: tagfinder[h].product_id}})
    }
    resdata[i] = tempdata;
  }

   res.json(resdata);
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  let resdata = {
    tag: null,
    products: []
  }
  resdata.tag = await Tag.findOne({where:{id: req.params.id}})
  .catch(function (err) {
    res.json(err)
  });
  let productfind = await ProductTag.findAll({where:{tag_id: req.params.id}});
  for (let i =0, len = productfind.length; i < len; i++) {
    resdata.products[i] = await Product.findOne({where:{id: productfind[i].product_id}})
  }
  res.json(resdata);
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    let putdata = await Tag.create(req.body);
    res.status(200).json(putdata);
  } catch (err) {
    res.status(200).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    let putdata = await Tag.update (req.body, {where:{id: req.params.id}});
    res.status(200).json(putdata);
  } catch (err) {
    res.status(200).json(err)
  }

});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
  let deldata = await Tag.destroy({where:{id: req.params.id}});
  res.status(200).json(err)
  } catch (err) {
    res.status(200).json(err)
  }
});

module.exports = router;
