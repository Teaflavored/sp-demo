import { stripLeadingSlash } from "../shared/strings";

class Api {
  constructor(private baseURL: string) {}

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(
        `${this.baseURL}/${stripLeadingSlash(endpoint)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return (await response.json()) as T;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      throw error;
    }
  }

  async post<T, U>(endpoint: string, data: T): Promise<U> {
    try {
      const response = await fetch(
        `${this.baseURL}/${stripLeadingSlash(endpoint)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          cache: "no-cache",
        }
      );

      return (await response.json()) as U;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      throw error;
    }
  }
}

export const api = new Api("/api");
