interface ServerConfigInput {
  PORT?: string;
  HOST?: string;
}

export interface ServerConfig {
  port: number;
  host: string;
}

export function getServerConfig(input: ServerConfigInput): ServerConfig {
  const port = Number(input.PORT ?? 43211);
  const host = input.HOST ?? "0.0.0.0";

  return {
    port,
    host
  };
}
