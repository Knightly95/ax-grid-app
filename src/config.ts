interface Config {
  api: {
    baseUrl: string;
  };
  socket: {
    url: string;
  };
}

export const config: Config = {
  api: {
    baseUrl: 'http://localhost:3000',
  },
  socket: {
    url: 'http://localhost:4001',
  },
};
