# How to create custom controller with Strapi  [ beginners guide ]

Let's create a custom controller for running a post report wich will show **_id_**, **_title_**, **_category_**,**_publsihedData_**, **_authorName_**, **_authorEmail_**.

```json
[
	{
		"id": 1,
		"title": "The internet's Own boy",
		"category": "story",
		"publishedDate": "Fri May 20 2022",
		"authorName": "David Doe",
		"authorEmail": "daviddoe@strapi.io"
	},
	{
		"id": 2,
		"title": "This shrimp is awesome",
		"category": "nature",
		"publishedDate": "Fri May 20 2022",
		"authorName": "David Doe",
		"authorEmail": "daviddoe@strapi.io"
	},
	{
		"id": 3,
		"title": "A bug is becoming a meme on the internet",
		"category": "tech",
		"publishedDate": "Fri May 20 2022",
		"authorName": "Sarah Baker",
		"authorEmail": "sarahbaker@strapi.io"
	},
	{
		"id": 4,
		"title": "Beautiful picture",
		"category": "nature",
		"publishedDate": "Fri May 20 2022",
		"authorName": "Sarah Baker",
		"authorEmail": "sarahbaker@strapi.io"
	},
	{
		"id": 5,
		"title": "What's inside a Black Hole",
		"category": "news",
		"publishedDate": "Fri May 20 2022",
		"authorName": "Sarah Baker",
		"authorEmail": "sarahbaker@strapi.io"
	}
]
```

The following command will create a local instance of Strapi running with generated blog data, including articles, authors, and categories.

```bash
 npx create-strapi-app demoapp --template blog --quickstart
```

<img width="1122" alt="register" src="https://user-images.githubusercontent.com/6153188/169604633-c102a584-e041-4d79-811a-7afc57d202b2.png">


Create an admin account, and once you are logged in, you should see the following data.

<img width="1506" alt="strapiblogdata" src="https://user-images.githubusercontent.com/6153188/169604722-44b0732d-2381-4e8e-befa-311bba86787e.png">


Navigate to your demoapp folder and run `npx strapi generate` to create a custom API endpoint.

```bash
? Strapi Generators (Use arrow keys)
❯ api - Generate a basic API 
  controller - Generate a controller for an API 
  content-type - Generate a content type for an API 
  plugin - Generate a basic plugin 
  policy - Generate a policy for an API 
  middleware - Generate a middleware for an API 
  service - Generate a service for an API
```

Make sure the API option is selected and click enter.

```bash
? Strapi Generators api - Generate a basic API
? API name // name your api
```

I will call my **_posts-report_** and select **_N_** for "Is this API for a plugin?"

```bash
? Strapi Generators api - Generate a basic API
? API name posts-report
? Is this API for a plugin? (Y/n)
```

It will generate these files below.

```bash
? Strapi Generators api - Generate a basic API
? API name posts-report
? Is this API for a plugin? No

✔  ++ /api/posts-report/routes/posts-report.js
✔  ++ /api/posts-report/controllers/posts-report.js
✔  ++ /api/posts-report/services/posts-report.js
```

We can find these in the `/api/posts-report` folder.

Now we can create custom **_routes_**, **_controllers_**, and **_services_**.

In the routes folder, we will paste the following code.

`/api/posts-report/routes/posts-report.js`

```javascript
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
```

Our handler will point to the custom controller that we will create. We will call it postsReport.

Now let's create our custom controller that will call our custom service that we will make afterward.

`/api/posts-report/controllers/posts-report.js`

In the controller folder, paste the below code.

```javascript
module.exports = {
  async postsReport(ctx, next) {
    try {
      const data = await strapi
        .service("api::posts-report.posts-report")
        .postsReport();

      console.log(data, "data");

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
```

Finally, let's create our custom service where we will handle our business logic to run our report.

`/api/posts-report/services/posts-report.js`

In the service folder, paste the following code.

```javascript
module.exports = {
  postsReport: async () => {
    try {
      // fetching data
      const entries = await strapi.entityService.findMany(
        "api::article.article",

        {
          fields: ["id", "title", "slug", "createdAt"],

          populate: {
            author: {
              fields: ["name", "email"],
            },

            category: {
              fields: ["name"],
            },
          },
        }
      );

      // reduce the data to the format we want to return
      let entriesReduced;

      if (entries && Array.isArray(entries)) {
        entriesReduced = entries.reduce((acc, item) => {
          acc = acc || [];

          acc.push({
            id: item.id,
            title: item.title || "",
            category: item.category.name || "",
            publishedDate: new Date(item.createdAt).toDateString() || "",
            authorName: item.author?.name || "",
            authorEmail: item.author?.email || "",
          });

          return acc;
        }, []);
      }

      // return the reduced data
      return entriesReduced;
    } catch (err) {
      return err;
    }
  },
};
```

For this to work, we must give our controller public access. We can do it in Settings -> Roles -> Public settings.

Make sure that you check the checkbox for our postsReport endpoint.

<img width="1509" alt="givepermission" src="https://user-images.githubusercontent.com/6153188/169604752-7283d94c-bcd4-4049-a3c3-c54b983619ca.png">


You can either go here directly in your browser `http://localhost:1337/api/posts-report` or make a GET request using a program like Postman or Insomnia.

You should now see your data coming from your custom controller.

<img width="1510" alt="response" src="https://user-images.githubusercontent.com/6153188/169604771-c90de727-9619-4558-a920-e80297126ec5.png">

Hope you had fun.
