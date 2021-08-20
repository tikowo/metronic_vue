import { App } from "vue";
import MockAdapter from "axios-mock-adapter";

type User = {
  name: string;
  surname: string;
  email: string;
  password: string;
  token: string;
};

// mock testing user accounts
const users: Array<User> = [
  {
    name: "Name",
    surname: "Surname",
    email: "admin@demo.com",
    password: "demo",
    token: "mgfi5juf74j"
  },
  {
    name: "Name",
    surname: "Surname",
    email: "admin2@demo.com",
    password: "demo",
    token: "fgj8fjdfk43"
  }
];

class MockService {
  public static init(app: App<Element>) {
    // this sets the mock adapter on the default instance
    const mock = new MockAdapter(app.axios);

    // mock login request
    mock.onPost("/login").reply(data => {
      const credential = JSON.parse(data.data);
      const found = users.find(user => {
        return (
          credential.email === user.email &&
          credential.password === user.password
        );
      });
      if (found) {
        return [200, found];
      }
      return [404, { errors: ["The login detail is incorrect"] }];
    });

    // mock registration request
    mock.onPost("/registration").reply(data => {
      const newUser = JSON.parse(data.data);
      if (
        newUser.name &&
        newUser.surname &&
        newUser.email &&
        newUser.password
      ) {
        const found = users.find(user => {
          return newUser.email === user.email;
        });
        if (!found) {
          newUser.token = Math.random()
            .toString(36)
            .substr(2, 9);
          users.push(newUser);
          return [200, newUser];
        }
        return [409, { errors: ["User with this email already exists."] }];
      }
      return [400, { errors: ["Please fill all needed fields to continue."] }];
    });

    // mock forgot password request
    mock.onPost("/forgot_password").reply(data => {
      const { email } = JSON.parse(data.data);

      if (email) {
        const user = users.find(
          x => x.email.toLowerCase() === email.toLowerCase()
        );
        if (user) {
          return [200, user];
        }
        return [404, { errors: ["Users with this email is not found."] }];
      }
      return [400, { errors: ["Please fill all needed fields to continue."] }];
    });

    // mock to verify authentication
    mock.onGet(/\/verify\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Token ", "");
      if (token !== "undefined") {
        const found = users.find(user => {
          return token === user.token;
        });
        return [200, found];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onGet(/\/users\/?/).reply(data => {
      const perPage = 4;
      const _data = [
        { id: 1, username: "Tigran", email: "1@gmailcom" },
        { id: 2, username: "Arshak", email: "2@gmailcom" },
        { id: 3, username: "Vardan", email: "3@gmailcom" },
        { id: 4, username: "Lilit", email: "4@gmailcom" },
        { id: 5, username: "Hakob", email: "5@gmailcom" },
        { id: 6, username: "Arpi", email: "6@gmailcom" },
        { id: 7, username: "Vardan", email: "7@gmailcom" },
        { id: 8, username: "Lilit", email: "8@gmailcom" },
        { id: 9, username: "Hakob", email: "9@gmailcom" },
        { id: 10, username: "Arpi", email: "10@gmailcom" }
      ];
      const page = data.params.page || 1;
      const orderBy = data.params.orderBy;
      const toReturn = _data
        .sort((a, b) => {
          if (orderBy) {
            if(orderBy[1] === 'desc') {
              if (a[orderBy[0]] > b[orderBy[0]]) return -1;
              return 1;
            } else {
              if (a[orderBy[0]] > b[orderBy[0]]) return 1;
              return -1;
            }
          }
          return 1;
        })
        .slice((page - 1) * perPage, page * perPage);

      return [
        200,
        {
          // eslint-disable-next-line @typescript-eslint/camelcase
          current_page: page,
          // eslint-disable-next-line @typescript-eslint/camelcase
          per_page: perPage,
          data: toReturn,
          total: _data.length
        }
      ];
    });
  }
}

export default MockService;
