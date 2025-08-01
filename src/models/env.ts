type Env = {
  server: {
    port: number;
  };
  database: {
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbPort: number;
    host: string;
    max: number;
    min: number;
    idle: number;
  };
  qdrant: {
    url: string;
    apiKey: string;
  };
  openai: {
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  jwt: {
    secret: string;
  };
};

export { Env };
