const showBlogs = async (req, res) => {
  try {
    var blogs = await blogtable.find({});
    res.status(200).send(blogs);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { showBlogs };
