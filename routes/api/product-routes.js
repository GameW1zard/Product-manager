const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  let resdata = []
  let Productdata = await Product.findAll().catch(function (err) {
    res.json(err);
  });

  for (let i = 0, len = Productdata.length; i < len; i++) {
    let tempdata = {
      product: null,
      category: null,
      tags: []
    }
    tempdata.product = await Product.findOne({where: {id: Productdata[i].id}})
    tempdata.category = await Category.findOne({where: {id: Productdata[i].category_id}})
    let tagfind = await ProductTag.findAll({where: {product_id: Productdata[i].id}})
    for (let h = 0, len = tagfind.length; h < len; h++) {
      tempdata.tags[h] = await Tag.findOne({where: {id: tagfind[h].tag_id}})
    }
    resdata[i] = tempdata;
  }

  res.json(resdata);
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  let Productdata = await Product.findOne({where: {id: req.params.id}})
  .catch(function (err) {
    res.json(err);
  });
  let resdata = {
    product: null,
    category: null,
    tags: []
  }
  resdata.category = await Category.findOne({where: {id: Productdata.category_id}})
  let tagfind = await ProductTag.findAll({where: {product_id: req.params.id}})
  for (let i = 0, len = tagfind.length; i < len; i++) {
    resdata.tags[i] = await Tag.findOne({where: {id: tagfind[i].id}})
  }
  resdata.product = Productdata;
  res.json(resdata);
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  try {
    let deldata = Product.destroy({where:{id: req.params.id}});
    res.status(200).json(deldata);
  } catch (err) {
    res.status(200).json(err)
  }
});

module.exports = router;
