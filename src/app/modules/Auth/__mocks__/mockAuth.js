import {
  LOGIN_URL,
  CONNECT_URL,
  ME_URL,
  BUSINESS_URL,
  REGISTER_URL,
  REQUEST_PASSWORD_URL
} from "../_redux/authCrud";
import userTableMock from "./userTableMock";

export default function mockAuth(mock) {
  mock.onPost(LOGIN_URL).reply(({ data }) => {
    const { email, password } = JSON.parse(data);

    if (email && password) {
      const user = userTableMock.find(
        x =>
          x.email.toLowerCase() === email.toLowerCase() &&
          x.password === password
      );

      if (user) {
        return [200, { ...user, password: undefined }];
      }
    }

    return [400];
  });

  mock.onPost(CONNECT_URL).reply(({ data }) => {
    const { businessName } = JSON.parse(data);

    if (businessName) {
      const _businessName = userTableMock.find(
        x => x.businessName.toLowerCase() === businessName.toLowerCase()
      );

      if (_businessName) {
        return [200, { ..._businessName }];
      }
    }
  });

  mock.onPost(REGISTER_URL).reply(({ data }) => {
    const { email, fullname, username, password } = JSON.parse(data);

    if (email && fullname && username && password) {
      const user = {
        id: generateUserId(),
        email,
        fullname,
        username,
        password,
        roles: [2], // Manager
        accessToken: "access-token-" + Math.random(),
        refreshToken: "access-token-" + Math.random(),
        pic: process.env.PUBLIC_URL + "/media/users/default.jpg"
      };

      userTableMock.push(user);

      return [200, { ...user, password: undefined }];
    }

    return [400];
  });

  mock.onPost(REQUEST_PASSWORD_URL).reply(({ data }) => {
    const { email } = JSON.parse(data);

    if (email) {
      const user = userTableMock.find(
        x => x.email.toLowerCase() === email.toLowerCase()
      );

      if (user) {
        user.password = undefined;

        return [200, { ...user, password: undefined }];
      }
    }

    return [400];
  });

  mock.onGet(ME_URL).reply(({ headers: { Authorization } }) => {
    const accessToken =
      Authorization &&
      Authorization.startsWith("Bearer ") &&
      Authorization.slice("Bearer ".length);

    if (accessToken) {
      const user = userTableMock.find(x => x.accessToken === accessToken);

      if (user) {
        return [200, { ...user, password: undefined }];
      }
    }

    return [401];
  });

  mock.onGet(BUSINESS_URL).reply(({ headers: { Authorization } }) => {
    const accessToken =
      Authorization &&
      Authorization.startsWith("Bearer ") &&
      Authorization.slice("Bearer ".length);

    if (accessToken) {
      const businessName = userTableMock.find(
        x => x.accessToken === accessToken
      );

      if (businessName) {
        return [200, { ...businessName }];
      }
    }

    return [401];
  });

  function generateUserId() {
    const ids = userTableMock.map(el => el.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
  }
}
