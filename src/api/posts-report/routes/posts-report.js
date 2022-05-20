module.exports = {
  routes: [
    {
      method: "GET",
      path: "/posts-report",
      handler: "posts-report.postsReport",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};